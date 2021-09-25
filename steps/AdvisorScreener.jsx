import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {useSelector} from 'react-redux';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import PromptModal from '<censored_path>/ui/components/modals/Prompt';
import AdvisorScreener from '<censored_path>/ui/components/AdvisorScreener';
import FormControls from '<censored_path>/ui/components/forms/Controls';
import {useMountGuard, useStateWithMountGuard} from '<censored_path>/ui/utils';

const SKIP_WARNING = `Heads up! Completing the survey is required in order to participate in this paid consultation
opportunity. It's ok if this particular opportunity is not a fit - you can confirm skipping the survey and
use <censored_text> to connect with other clients.`;

export default function AdvisorScreenerStep({skipStep, confirmStep, noBackButton, goBack}) {
  const mountGuard = useMountGuard();

  const perspectiveId = localStorage.signupPerspectiveId;
  const [isPromptOpen, setIsPromptOpen] = useStateWithMountGuard(mountGuard, false);
  const perspApplication = useSelector((state) => state.models.applicationsByPerspective?.[perspectiveId] || [])[0];

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">See if you’re a fit</H4>
        <P1 className="onboarding-header-subtitle">We use short surveys to ensure you’re a match for the call.</P1>
      </div>

      <Form className="responsive-form" onSubmit={confirmStep}>
        <AdvisorScreener perspectiveId={perspectiveId} onNotFound={confirmStep} />

        <FormControls>
          <Button
            color={Button.STYLES.MINIMAL}
            className={cn('form-controls-cancel', {invisible: noBackButton})}
            onClick={goBack}
          >
            <Icon icon="caret_left" className="mr-1" />
            Back
          </Button>

          <Button data-test="skip" color={Button.STYLES.MINIMAL} onClick={() => setIsPromptOpen(true)}>
            Skip
          </Button>

          <Button disabled={!perspApplication?.has_submitted_screener} type="submit">
            Continue
          </Button>
        </FormControls>
      </Form>
      {isPromptOpen && <PromptModal isOpen setIsOpen={setIsPromptOpen} onConfirm={skipStep} subtitle={SKIP_WARNING} />}
    </div>
  );
}

AdvisorScreenerStep.propTypes = {
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};
