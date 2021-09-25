import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button, Icon} from '<censored_path>/ui/components';
import Multiplier from '<censored_path>/ui/components/forms/Multiplier';
import api from '<censored_path>/ui/api';
import {displayError, getAuthState} from '<censored_path>/ui/utils';
import {validateEmailsDomain} from '<censored_path>/ui/utils/client_company';
import FormControls from '<censored_path>/ui/components/forms/Controls';
import TextInput from '<censored_path>/ui/components/forms/TextInput';
import styles from '<censored_path>/ui/page_impls/Onboarding/steps/InviteTeammates.module.scss';

function SuccessMessage() {
  return (
    <div className="w-min mr-2 ml-auto mt-2 text-boldGreen" data-test="successMsg">
      Sent!
    </div>
  );
}

function MemberInvite({onChange, errorMsg, companyDomain}) {
  return (
    <TextInput
      name="email"
      className={styles.input}
      placeholder="email@example.com"
      type={TextInput.TYPES.EMAIL}
      label="Email"
      onChange={onChange}
      errorMsg={errorMsg}
      validator={validateEmailsDomain(companyDomain)}
      isRequired
    />
  );
}

MemberInvite.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
  companyDomain: PropTypes.string.isRequired,
};

export default function InviteTeammates({confirmStep, skipStep, noBackButton, goBack}) {
  const [wasSent, setWasSent] = useState();
  const company = useSelector((state) => getAuthState(state).user.permission_company);

  async function onSubmit(data) {
    try {
      await api.company.invite(data.teammates_invites);
    } catch (e) {
      displayError('Error sending invites', {exception: e});
      throw e;
    }

    setWasSent(true);
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Invite co-workers to your team</H4>
        <P1 className="onboarding-header-subtitle">
          Collaborate on projects at no extra cost per seat. This step is optional.
        </P1>
      </div>

      <Form onSubmit={onSubmit}>
        <Multiplier
          className="rounded-xl p-2 bg-grayBackdrop"
          label={<P1 className="text-grayDark">Invite team members to collaborate on <censored_text></P1>}
          name="teammates_invites"
          itemComponent={MemberInvite}
          cta="+ Add member"
          addTrackEventName="onboarding_addMemberClicked"
          removeTrackEventName="onboarding_removeMemberClicked"
          companyDomain={company.email_domain}
          removeButton={
            <Button color={Button.STYLES.NONE} className="align-top text-brand ml-2 mt-1">
              <Icon icon="close" size={Icon.Sizes.MEDIUM} />
            </Button>
          }
        />

        {wasSent ? (
          <SuccessMessage />
        ) : (
          <Button className="ml-auto mt-2" color={Button.STYLES.SECONDARY} type="submit">
            Send invites
          </Button>
        )}
      </Form>

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
        <Button onClick={confirmStep} disabled={!wasSent} testSel="onboardingInviteTeammatesContinue">
          Continue
        </Button>
      </FormControls>
    </div>
  );
}

InviteTeammates.propTypes = {
  confirmStep: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};
