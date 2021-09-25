import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styled from 'styled-components';
import {H4, H6, P1, P3} from '<censored_path>/ui/components/text';
import {Button} from '<censored_path>/ui/components';
import models from '<censored_path>/ui/models';
import {fetchModels, useMountGuard, useStateWithMountGuard} from '<censored_path>/ui/utils';
import Loader from '<censored_path>/ui/components/Loader';
import {useSelector} from 'react-redux';
import Icon from '<censored_path>/ui/components/Icon';
import CallRequestDetailsModal from '<censored_path>/ui/components/modals/CallRequestDetails';
import {CALL_ACCEPT_STATUSES} from '<censored_path>/shared/calls/definitions';
import consultCallActions from '<censored_path>/ui/model_actions/calls';
import FormControls from '<censored_path>/ui/components/forms/Controls';

function ConsultationReqDetail({className, consultCall, setCallReqDetails}) {
  const duration = consultCall?.proposed_duration ? consultCall.proposed_duration / 60 : 60;
  const isPending = consultCall.accept_status === CALL_ACCEPT_STATUSES.PENDING_HOST;

  return (
    <div className={className}>
      <P1 className="onboarding-pending-call-details-label">Consultation request</P1>

      <div className="onboarding-pending-call-details-info">
        <div className="consultation-req-detail">
          <P3>YOUR RATE</P3>
          <H6>{consultCall.rate_hr / 100}/hr</H6>
        </div>
        <div className="consultation-req-detail">
          <P3>DURATION</P3>
          <H6>{duration} minutes</H6>
        </div>
        {!isPending && consultCall.accept_status === CALL_ACCEPT_STATUSES.DECLINED && (
          <P1 className="consultation-req-details-call-status declined">Declined!</P1>
        )}
        {!isPending &&
          (consultCall.accept_status === CALL_ACCEPT_STATUSES.ACCEPTED || // WIP_RENAME_FILTER Remove UPCOMING
            consultCall.accept_status === CALL_ACCEPT_STATUSES.UPCOMING) && (
            <P1 className="consultation-req-details-call-status">Confirmed!</P1>
          )}
        {isPending && <Button onClick={() => setCallReqDetails(consultCall)}>Review request</Button>}
      </div>
    </div>
  );
}

ConsultationReqDetail.propTypes = {
  className: PropTypes.string.isRequired,
  consultCall: PropTypes.object.isRequired,
  setCallReqDetails: PropTypes.func.isRequired,
};

ConsultationReqDetail = styled(ConsultationReqDetail)`
  border: 1px solid #f0f2f4;
  box-shadow: 0px 1px 4px ${(props) => props.theme.colors.grayLight};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 0 0 40px;

  .onboarding-pending-call-details-label {
    font-weight: ${(props) => props.theme.fonts.weights.semibold};
    margin-bottom: 1.5rem;
  }
  .onboarding-pending-call-details-info {
    display: flex;
    justify-content: space-between;
  }

  .consultation-req-detail {
    p {
      font-weight: ${(props) => props.theme.fonts.weights.semibold};
      color: ${(props) => props.theme.colors.grayDark};
      margin: 0 0 0.5rem;
    }
    h6 {
      color: ${(props) => props.theme.colors.brand};
      font-weight: ${(props) => props.theme.fonts.weights.semibold};
    }
  }
  .consultation-req-details-call-status {
    font-weight: ${(props) => props.theme.fonts.weights.semibold};
    color: ${(props) => props.theme.colors.boldGreen};
    margin: auto 0;
  }
  .declined {
    color: ${(props) => props.theme.colors.error};
  }
`;

export default function PendingCall({className, user, confirmStep, skipStep, noBackButton, goBack}) {
  const mountGuard = useMountGuard();

  const [consultCallsIds, setConsultCallsIds] = useStateWithMountGuard(mountGuard, null);
  const [isSubmitting, setIsSubmitting] = useStateWithMountGuard(mountGuard, false);
  const [callReqDetails, setCallReqDetails] = useStateWithMountGuard(mountGuard, null);
  const consultCalls = useSelector(
    (state) => consultCallsIds?.map((callId) => (state.models.consult_calls || {})[callId]) || []
  );

  useEffect(() => {
    (async () => {
      const consultCalls = await fetchModels(models.ConsultCall, {
        fetchParams: {
          includeFields: 'required_attestations',
          proposed_times__gt: new Date().toISOString(),
          sort: 'proposed_times',
        },
      });
      const callsCount = consultCalls.length;
      trackEvent('onboarding_pendingCallsCount', {count: callsCount});
      if (!callsCount) {
        confirmStep();
        return;
      }
      setConsultCallsIds(consultCalls.map((c) => c.id));
    })();
  }, []);

  function withCloseModal(consultCallAction) {
    return function (data) {
      consultCallAction(data, callReqDetails, {isSubmitting, setIsSubmitting});
      setCallReqDetails(null);
    };
  }

  function onCancel() {
    trackEvent('conversationRequest_detailsClosed', {conversationId: callReqDetails.id});
    setCallReqDetails(null);
  }

  const isFetching = consultCallsIds === null;
  const hasPendingRequests = !!consultCalls.find((call) => call.accept_status === CALL_ACCEPT_STATUSES.PENDING_HOST);

  return (
    <div className="onboarding-page onboarding-pending-call">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Your consultation awaits!</H4>
        <P1 className="onboarding-header-subtitle">
          We’re excited to have you aboard. Please review your consultation request details below. Once you’re done,
          confirm the request to continue.
        </P1>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <div className={className}>
          {consultCalls.map((consultCall, i) => (
            <ConsultationReqDetail key={i} consultCall={consultCall} setCallReqDetails={setCallReqDetails} />
          ))}

          <FormControls>
            <Button
              className={cn('form-controls-cancel', {invisible: noBackButton})}
              color={Button.STYLES.MINIMAL}
              onClick={goBack}
            >
              <Icon icon="caret_left" className="mr-1" />
              Back
            </Button>
            <Button data-test="skip" color={Button.STYLES.MINIMAL} onClick={skipStep}>
              Skip
            </Button>
            <Button type="submit" onClick={confirmStep} disabled={hasPendingRequests}>
              Continue
            </Button>
          </FormControls>
        </div>
      )}

      {callReqDetails && (
        <CallRequestDetailsModal
          consultCall={callReqDetails}
          isOpen
          onCancel={onCancel}
          onAccept={withCloseModal(consultCallActions.accept)}
          onDecline={withCloseModal(consultCallActions.decline)}
          onReschedule={withCloseModal(consultCallActions.reschedule)}
        />
      )}
    </div>
  );
}

PendingCall.propTypes = {
  className: PropTypes.string.isRequired,
  noBackButton: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  confirmStep: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

PendingCall = styled(PendingCall)``;
