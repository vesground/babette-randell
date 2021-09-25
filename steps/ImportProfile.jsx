import PropTypes from 'prop-types';
import React from 'react';
import ImportProfile from '<censored_path>/ui/components/ImportProfile';
import FormControls from '<censored_path>/ui/components/forms/Controls';
import {Button, Icon} from '<censored_path>/ui/components';

export default function ImportProfileStep({user, confirmStep, skipStep, goBack}) {
  return (
    <div className="onboarding-page">
      <ImportProfile user={user} onSkip={skipStep} onContinue={confirmStep} goBack={goBack} />

      <FormControls>
        <Button color={Button.STYLES.MINIMAL} className="form-controls-cancel" onClick={goBack}>
          <Icon icon="caret_left" className="mr-1" />
          Back
        </Button>
        <Button data-test="skip" type="button" color={Button.STYLES.MINIMAL} onClick={skipStep}>
          Skip
        </Button>
        <Button type="submit" disabled={!user.work_history?.length} onClick={confirmStep}>
          Continue
        </Button>
      </FormControls>
    </div>
  );
}

ImportProfileStep.propTypes = {
  user: PropTypes.object.isRequired,
  confirmStep: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};
