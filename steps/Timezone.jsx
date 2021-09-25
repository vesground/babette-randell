import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import styled from 'styled-components';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import TzPicker from '<censored_path>/ui/components/forms/TzPicker';
import {guessTz} from '<censored_path>/shared/utils';
import {DEFAULT_LOCATION_VALUES} from '<censored_path>/ui/utils/location_utils';
import Autocomplete from '<censored_path>/ui/components/forms/Autocomplete';
import TextInput from '<censored_path>/ui/components/forms/TextInput';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function Timezone({className, user, updateUser, confirmStep, noBackButton, goBack}) {
  async function onSubmit({tz, ...location}) {
    await updateUser({tz, ...(isEmpty(location) ? DEFAULT_LOCATION_VALUES : location)});
    confirmStep();
  }

  return (
    <div className={cn(className, 'onboarding-page')}>
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Where are you located?</H4>
        <P1 className="onboarding-header-subtitle">
          <censored_text> are held across the world. Setting your location and time zone helps us ensure a smooth
          consultation for you and our advisors.
        </P1>
      </div>

      <Form className="responsive-form onboarding-user-timezone" onSubmit={onSubmit}>
        <Autocomplete
          name="location"
          type={TextInput.TYPES.TEXT}
          isLocation
          defaultValue={user}
          label="Your location"
          className="onboarding-user-location"
          isRequired
        />

        <TzPicker name="tz" label="Preferred time zone" defaultValue={user.tz || guessTz()} />

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

Timezone.propTypes = {
  className: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};

Timezone = styled(Timezone)`
  height: 30rem;
  .onboarding-user-location .input-wrapper {
    margin: 0;
  }
`;
