import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {H4, P1, P2} from '<censored_path>/ui/components/text';
import TextInput from '<censored_path>/ui/components/forms/TextInput';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import ProfilePictureUpload from '<censored_path>/ui/components/users/ProfilePictureUpload';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function General({className, user, updateUser, confirmStep, noBackButton, goBack}) {
  async function submit(data) {
    await updateUser(data);
    confirmStep();
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Share a bit about yourself</H4>
        <P1 className="onboarding-header-subtitle">This will be the name associated with your new account.</P1>
      </div>

      <Form className={cn(className, 'responsive-form', 'onboarding-user-data')} onSubmit={submit}>
        <div>
          <P2 className="onboarding-user-image-title">Profile picture</P2>
          <ProfilePictureUpload user={user} />
        </div>

        <div className="onboarding-user-name">
          <TextInput
            name="first_name"
            label="Legal first name"
            defaultValue={user.first_name}
            isRequired
            type={TextInput.TYPES.TEXT}
          />
          <TextInput
            name="last_name"
            label="Legal last name"
            defaultValue={user.last_name}
            isRequired
            type={TextInput.TYPES.TEXT}
          />
          <TextInput
            name="preferred_name"
            label="Preferred name"
            defaultValue={user.preferred_name}
            type={TextInput.TYPES.TEXT}
            placeholder="The name you go by"
          />
        </div>

        <div className="onboarding-user-phone">
          <TextInput
            name="phone"
            label="Phone number"
            defaultValue={user.phone}
            isRequired
            type={TextInput.TYPES.PHONE}
          />
          <P2 className="onboarding-user-phone-disclaimer">
            Only used in case of last-minute contact regarding consultations
          </P2>
        </div>

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

General.propTypes = {
  className: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};

General = styled(General)`
  .onboarding-user-image-title {
    margin: 0 0 0.5rem;
    font-weight: 500;
  }
  .onboarding-user-name {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .onboarding-user-phone .onboarding-user-phone-disclaimer {
    margin: 0.5rem 0 0;
    color: ${(props) => props.theme.colors.grayMedium};
  }
  .onboarding-user-phone,
  .onboarding-user-name {
    .input-wrapper {
      margin: 0;
    }
  }
  @media all and (max-width: 460px) {
    .onboarding-user-name {
      display: initial;
      .input-wrapper {
        margin: 1.5rem 0;
      }
    }
  }
`;
