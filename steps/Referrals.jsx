import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button, Icon} from '<censored_path>/ui/components';
import Multiplier from '<censored_path>/ui/components/forms/Multiplier';
import {REFERRAL_BONUS} from '<censored_path>/shared/users/definitions';
import api from '<censored_path>/ui/api';
import {displayError} from '<censored_path>/ui/utils';
import ReferralForm from '<censored_path>/ui/components/ReferralForm';
import FormControls from '<censored_path>/ui/components/forms/Controls';

const OnboardingReferralInput = styled(ReferralForm)`
  display: grid;
  row-gap: 1rem;
  padding: 1rem 1rem 2rem;
  border-radius: 0.75rem;
  background: ${(props) => props.theme.colors.grayBackdrop};
`;

export default function ReferralsStep({className, confirmStep, skipStep, noBackButton, goBack}) {
  async function onSubmit(data) {
    try {
      await api.perspectives.refer(localStorage.referralPerspectiveId, data);
    } catch (e) {
      displayError('Error submitting referrals', {exception: e});
      throw e;
    }

    confirmStep();
  }

  return (
    <div className={cn(className, 'onboarding-page')}>
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Know someone else who&apos;d be a good fit?</H4>
        <P1 className="onboarding-header-subtitle">
          Refer a friend or colleague, and we’ll pay you a ${REFERRAL_BONUS} referral bonus when they complete their
          first call.
        </P1>
      </div>

      <P1 className="onboarding-referral-label">Refer a friend or colleague</P1>

      <Form onSubmit={onSubmit} className="onboarding-referrals-form" clearOnSubmit disableOnNoChanges>
        <Multiplier
          name="referrals"
          itemComponent={OnboardingReferralInput}
          cta="Add another referral"
          addTrackEventName="onboarding_addAnotherReferralClicked"
          removeTrackEventName="onboarding_removeReferralClicked"
          removeButton={<Button color={Button.STYLES.NONE}>Remove</Button>}
          isRequired
        />
        <FormControls>
          <Button
            color={Button.STYLES.MINIMAL}
            className={cn('form-controls-cancel', {invisible: noBackButton})}
            onClick={goBack}
          >
            <Icon icon="caret_left" className="mr-1" />
            Back
          </Button>
          <Button data-test="skip" color={Button.STYLES.MINIMAL} onClick={skipStep}>
            Skip
          </Button>
          <Button type="submit">Continue</Button>
        </FormControls>
      </Form>
    </div>
  );
}

ReferralsStep.propTypes = {
  className: PropTypes.string.isRequired,
  confirmStep: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};

ReferralsStep = styled(ReferralsStep)`
  .onboarding-referral-label {
    margin: 2rem 0 0;
    font-weight: ${(props) => props.theme.fonts.weights.semibold};
  }
  .onboarding-referral-note {
    margin: 0.5rem 0 1rem;
    color: ${(props) => props.theme.colors.grayMedium};
  }
  .multiplier-item {
    position: relative;
    .multiplier-btn-remove {
      position: absolute;
      bottom: 4px;
      color: ${(props) => props.theme.colors.error};
    }
    &:not(:first-child) {
      margin: 0.5rem 0 0;
    }
  }
  .multiplier-btn-add {
    margin: 4px 0 0;
    padding-bottom: 0;
  }
`;
