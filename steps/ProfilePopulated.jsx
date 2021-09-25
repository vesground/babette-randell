import React from 'react';
import {Button} from '<censored_path>/ui/components';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Form from '<censored_path>/ui/components/forms/Form';
import Icon from '<censored_path>/ui/components/Icon';
import {H4, P1} from '<censored_path>/ui/components/text';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function ProfilePopulatedStep({confirmStep, noBackButton, goBack}) {
  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">We populated your profile 🎉</H4>
        <P1 className="onboarding-header-subtitle">
          For your convenience, our team filled your profile to the best of our ability. You’ll be able to edit or
          update things like career history, education, and knowledge areas from your profile.
        </P1>
      </div>

      <Form className="linkedin-found-form" onSubmit={confirmStep}>
        <FormControls isJustified>
          <Button
            className={cn('form-controls-cancel', {invisible: noBackButton})}
            onClick={goBack}
            color={Button.STYLES.MINIMAL}
          >
            <Icon icon="caret_left" className="mr-1" />
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </FormControls>
      </Form>
    </div>
  );
}

ProfilePopulatedStep.propTypes = {
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};
