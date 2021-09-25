import React from 'react';
import PropTypes from 'prop-types';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import Link from '<censored_path>/ui/components/Link';
import TextInput from '<censored_path>/ui/components/forms/TextInput';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function HourlyRate({user, updateUser, confirmStep, noBackButton, goBack}) {
  async function submit(data) {
    await updateUser(data);
    confirmStep();
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Your preferred rate</H4>
        <P1 className="onboarding-header-subtitle">
          We do our best to honor your preferred rate for your future <censored_text> consultations. Need help choosing
          your rate?
          <Link target="_blank" to="/post/how-to-set-your-hourly-consulting-rate">
            Learn more
          </Link>
        </P1>
      </div>

      <Form className="responsive-form onboarding-user-rate" onSubmit={submit}>
        <TextInput
          name="default_rate_hr"
          defaultValue={user.default_rate_hr}
          type={TextInput.TYPES.CURRENCY}
          minValue={1}
          label="Name your hourly rate"
          isRequired
          placeholder="$.00"
        />

        <FormControls isJustified>
          <Button
            color={Button.STYLES.MINIMAL}
            className={cn('form-controls-cancel', {invisible: noBackButton})}
            onClick={goBack}
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

HourlyRate.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};
