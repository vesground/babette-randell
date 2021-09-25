import React, {useState} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styled from 'styled-components';
import {H4, H6, P1, P2} from '<censored_path>/ui/components/text';
import api from '<censored_path>/ui/api';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import Form from '<censored_path>/ui/components/forms/Form';
import TextInput from '<censored_path>/ui/components/forms/TextInput';
import {displayError} from '<censored_path>/ui/utils';
import FormControls from '<censored_path>/ui/components/forms/Controls';

const ResendVerificationEmailForm = ({className, onSubmit, email}) => {
  const resendEmail = async ({email}) => {
    try {
      return await onSubmit(email);
    } catch (e) {
      displayError('Cannot send the email.', {exception: e});
    }
  };

  return (
    <Form className={className} onSubmit={resendEmail}>
      <div>
        <TextInput name="email" label="Email" type={TextInput.TYPES.EMAIL} defaultValue={email} isRequired />
        <Button className="onboarding-verification-resend-btn" type="submit">
          Send
        </Button>
      </div>
    </Form>
  );
};

ResendVerificationEmailForm.propTypes = {
  className: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  email: PropTypes.string,
};

const ResendVerificationEmailFormInline = styled(ResendVerificationEmailForm)`
  & > :last-child {
    display: flex;
    align-items: flex-start;

    & > :first-child {
      flex: 1;
    }

    .onboarding-verification-resend-btn {
      padding: 14px 26px;
      margin: 52px 0 0 16px;
    }
  }
`;

const EmailVerification = ({className, user, noBackButton}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sentTo, setSentTo] = useState(null);

  const onSubmit = async (email) => {
    await api.resendVerificationEmail(email);
    setIsEditing(false);
    setSentTo(email);
  };

  return (
    <div className={cn(className, 'onboarding-page')}>
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Check your email!</H4>
        <P1 className="onboarding-header-subtitle">
          We’ve sent a message to <span>{user.email}</span> with a link to activate your account.
        </P1>
        <H6 className="onboarding-header-title">Didn’t get an email?</H6>
        <P1 className="onboarding-header-subtitle">
          In the spirit of knowledge sharing, here’s what may have gone awry.
        </P1>
      </div>
      <ul>
        <li className="onboarding-header-subtitle">The email may have gotten lost in your spam folder.</li>
        <li className="onboarding-header-subtitle">Not there? The email you provided may have a minor typo.</li>
        <li className="onboarding-header-subtitle">
          Still no email? Did you possibly you give us your personal email instead of your work email, or vice versa?
        </li>
        <li className="onboarding-header-subtitle">
          OK, take 2. Try re-entering your email below so we can try sending you another one.
        </li>
      </ul>
      {isEditing ? (
        <ResendVerificationEmailFormInline onSubmit={onSubmit} email={user.email} />
      ) : (
        <Button
          color={Button.STYLES.MINIMAL}
          onClick={() => {
            setIsEditing(true);
            setSentTo(null);
          }}
        >
          Re-enter your email and try again
        </Button>
      )}
      {!isEditing && sentTo && (
        <P2 className="email-sent-message">
          A confirmation email is on its way to {sentTo} if it&apos;s not taken by another user.
        </P2>
      )}
      {!noBackButton && (
        <FormControls>
          <Button color={Button.STYLES.MINIMAL} className="form-controls-cancel" onClick={<censored>History.goBack}>
            <Icon icon="caret_left" className="mr-1" />
            Back
          </Button>
        </FormControls>
      )}
    </div>
  );
};

EmailVerification.propTypes = {
  user: PropTypes.object.isRequired,
  noBackButton: PropTypes.bool,
  className: PropTypes.string.isRequired,
};

export default styled(EmailVerification)`
  .onboarding-header h6.onboarding-header-title {
    margin-top: 2rem;
  }

  .onboarding-header-subtitle span {
    font-weight: ${(props) => props.theme.fonts.weights.bold};
  }

  ul {
    list-style: inside;
    color: ${(props) => props.theme.colors.grayDark};
    line-height: 24px;

    li {
      font-weight: normal;
      margin-top: 1rem;

      span {
        position: relative;
      }
    }
  }

  & > button {
    margin-top: 1rem;
  }

  .email-sent-message {
    color: ${(props) => props.theme.colors.boldGreen};
  }
`;
