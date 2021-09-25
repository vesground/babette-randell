import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {H4, P1} from '<censored_path>/ui/components/text';
import cn from 'classnames';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import UserAvailability from '<censored_path>/ui/components/users/Availability';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function Availability({className, user, updateUser, confirmStep, skipStep, noBackButton, goBack}) {
  return (
    <div className={cn(className, 'onboarding-page onboarding-user-availability')}>
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Provide your availability</H4>
        <P1 className="onboarding-header-subtitle">
          Please provide some availability within the next 7 business days. This helps us make the scheduling experience
          with the client as smooth as possible for you.
        </P1>
      </div>

      <UserAvailability user={user} />

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
        <Button type="submit" onClick={confirmStep} disabled={!user.user_availability?.length}>
          Continue
        </Button>
      </FormControls>
    </div>
  );
}

Availability.propTypes = {
  className: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  confirmStep: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};

Availability = styled(Availability)`
  min-height: 30rem;
`;
