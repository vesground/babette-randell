import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {H4, P1, P2} from '<censored_path>/ui/components/text';
import TextInput from '<censored_path>/ui/components/forms/TextInput';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import Checkbox from '<censored_path>/ui/components/forms/Checkbox';
import {TERMS_HTML} from '<censored_path>/ui/utils';
import companyActions from '<censored_path>/ui/model_actions/client_companies';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function AboutClient({className, user, updateUser, confirmStep, noBackButton, goBack}) {
  async function submit(data) {
    data.work_history = [
      {
        title: data.job_title,
        company_name: data.company,
      },
    ];

    if (user.permission_company === null) {
      await companyActions.create(data.company, user.id);
    }

    delete data.company;
    delete data.job_title;
    delete data.tos;

    await updateUser(data);
    confirmStep();
  }

  const workHistory = user.work_history?.[0];

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">About you</H4>
        <P1 className="onboarding-header-subtitle">We need a few pieces of information to get your account set up.</P1>
      </div>
      <Form className={cn(className, 'onboarding-client-about')} onSubmit={submit}>
        <div className="onboarding-client-about-name">
          <TextInput
            name="first_name"
            label="First name"
            defaultValue={user.first_name}
            isRequired
            type={TextInput.TYPES.TEXT}
          />

          <TextInput
            name="last_name"
            label="Last name"
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

        <TextInput
          name="phone"
          label="Phone number"
          defaultValue={user.phone}
          isRequired
          type={TextInput.TYPES.PHONE}
        />

        <TextInput
          name="job_title"
          label="Job title"
          defaultValue={workHistory?.title}
          isRequired
          type={TextInput.TYPES.TEXT}
        />

        <TextInput
          name="company"
          label="Company"
          isRequired
          type={TextInput.TYPES.TEXT}
          disabled={!!localStorage.signupCompanyName}
          defaultValue={localStorage.signupCompanyName || workHistory?.company_name}
        />
        <div className="onboarding-client-terms">
          <P2>Terms & Conditions</P2>
          <Checkbox
            name="tos"
            isRequired
            description={<>I have reviewed and agree to the <censored_text> {TERMS_HTML}.</>}
          />
        </div>
        <FormControls isJustified>
          {!noBackButton && (
            <Button color={Button.STYLES.MINIMAL} className="form-controls-cancel" onClick={goBack}>
              <Icon icon="caret_left" className="mr-1" />
              Back
            </Button>
          )}
          <Button type="submit">Continue</Button>
        </FormControls>
      </Form>
    </div>
  );
}

AboutClient.propTypes = {
  className: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};

AboutClient = styled(AboutClient)`
  display: grid;
  row-gap: 1.5rem;
  .onboarding-client-about-name {
    display: grid;
    column-gap: 1.5rem;
    row-gap: 1.5rem;
    grid-template-columns: 1fr 1fr;
  }
  .input-wrapper {
    margin: 0;
  }
  .checkbox {
    margin: 16px 0 0;
  }
  @media all and (max-width: ${(props) => props.theme.breakpoints.xs}) {
    .onboarding-client-about-name {
      grid-template-columns: 1fr;
    }
  }
`;
