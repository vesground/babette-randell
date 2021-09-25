import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AUTH_USER_TYPES from '<censored_path>/auth_user_types';
import Page, {PageContentSection} from '<censored_path>/components/page';
import Redirect from '<censored_path>/components/Redirect';
import {useSelector} from 'react-redux';
import {getAuthState, updateModel, getDashboardUrl, localStorageGet, localStorageSet} from '<censored_path>/utils';
import models from '<censored_path>/models';
import GeneralStep from '<censored_path>/page_impls/Onboarding/steps/General';
import TimezoneStep from '<censored_path>/page_impls/Onboarding/steps/Timezone';
import AvailabilityStep from '<censored_path>/page_impls/Onboarding/steps/Availability';
import ImportProfileStep from '<censored_path>/page_impls/Onboarding/steps/ImportProfile';
import ProfilePopulatedStep from '<censored_path>/page_impls/Onboarding/steps/ProfilePopulated';
import HourlyRateStep from '<censored_path>/page_impls/Onboarding/steps/HourlyRate';
import KnowledgeStep from '<censored_path>/page_impls/Onboarding/steps/Knowledge';
import AboutClientStep from '<censored_path>/page_impls/Onboarding/steps/AboutClient';
import AboutCompanyStep from '<censored_path>/page_impls/Onboarding/steps/AboutCompany';
import PendingCallStep from '<censored_path>/page_impls/Onboarding/steps/PendingCall';
import ReferralsStep from '<censored_path>/page_impls/Onboarding/steps/Referrals';
import EmailVerification from '<censored_path>/page_impls/Onboarding/steps/EmailVerification';
import InviteTeammatesStep from '<censored_path>/page_impls/Onboarding/steps/InviteTeammates';
import AdvisorScreener from '<censored_path>/page_impls/Onboarding/steps/AdvisorScreener';
import ProgressBar from '<censored_path>/page_impls/Onboarding/ProgressBar';

const GENERAL_STEP = {url: 'general', component: GeneralStep};
const TIMEZONE_STEP = {url: 'timezone', component: TimezoneStep};
const AVAILABILITY_STEP = {url: 'availability', component: AvailabilityStep};
const IMPORT_PROFILE_STEP = {url: 'import', component: ImportProfileStep};
const PROFILE_POPULATED_STEP = {url: 'profile-populated', component: ProfilePopulatedStep};
const HOURLY_RATE_STEP = {url: 'hourly-rate', component: HourlyRateStep};
const KNOWLEDGE_AREAS_STEP = {url: 'knowledge-areas', component: KnowledgeStep};
const ABOUT_CLIENT_STEP = {url: 'about-client', component: AboutClientStep};
const ABOUT_COMPANY_STEP = {url: 'about-company', component: AboutCompanyStep};
const PENDING_CALL_STEP = {url: 'pending-call', component: PendingCallStep};
const REFERRAL_STEP = {url: 'referrals', component: ReferralsStep};
const INVITE_TEAMMATES_STEP = {url: 'invite-teammates', component: InviteTeammatesStep};
const EMAIL_VERIFICATION_STEP = {url: 'email-verification', component: EmailVerification};
const ADVISOR_SCREENER_STEP = {url: 'screener', component: AdvisorScreener};

const STEPS = [
  GENERAL_STEP,
  IMPORT_PROFILE_STEP,
  PROFILE_POPULATED_STEP,
  TIMEZONE_STEP,
  AVAILABILITY_STEP,
  HOURLY_RATE_STEP,
  KNOWLEDGE_AREAS_STEP,
  ABOUT_CLIENT_STEP,
  ABOUT_COMPANY_STEP,
  PENDING_CALL_STEP,
  REFERRAL_STEP,
  EMAIL_VERIFICATION_STEP,
  ADVISOR_SCREENER_STEP,
  INVITE_TEAMMATES_STEP,
];
const STEPS_BY_URL = Object.fromEntries(STEPS.map((s) => [s.url, s.component]));

const TRACKING_EVENTS = {
  BACK: 'onboarding_stepBack',
  SKIP: 'onboarding_stepSkipped',
  CONFIRM: 'onboarding_stepConfirmed',
  SHOWN: 'onboarding_stepShown',
};

function getInitialSteps({user, isClient}) {
  let initialSteps = localStorageGet('initialSteps');
  if (initialSteps) return initialSteps;

  initialSteps = [];
  isClient = isClient || !!localStorageGet('isClientSignup');

  if (!isClient) {
    const step = user.work_history?.length ? PROFILE_POPULATED_STEP.url : IMPORT_PROFILE_STEP.url;
    initialSteps.push(step);
  }

  if (!isClient) {
    initialSteps.push(GENERAL_STEP.url);
  }

  if (isClient) {
    initialSteps.push(ABOUT_CLIENT_STEP.url);
  }

  if (isClient && user.permission_company === null) {
    initialSteps.push(ABOUT_COMPANY_STEP.url);
  }

  if (!isClient && !user.num_pending_requests && localStorage.perspectiveTypeformUrl) {
    initialSteps.push(ADVISOR_SCREENER_STEP.url);
  }

  if (!isClient && !user.num_pending_requests && localStorage.signupPerspectiveId) {
    initialSteps.push(AVAILABILITY_STEP.url);
  }

  if (!isClient && user.num_pending_requests) {
    initialSteps.push(PENDING_CALL_STEP.url);
  }

  if (!user.tz) {
    initialSteps.push(TIMEZONE_STEP.url);
  }

  if (!isClient && !user.default_rate_hr) {
    initialSteps.push(HOURLY_RATE_STEP.url);
  }

  if (!isClient) {
    initialSteps.push(KNOWLEDGE_AREAS_STEP.url);
  }

  if (!isClient && localStorage.referralPerspectiveId) {
    initialSteps.push(REFERRAL_STEP.url);
  }

  if (isClient) {
    initialSteps.push(INVITE_TEAMMATES_STEP.url);
  }

  if (!user.is_email_verified) {
    initialSteps.push(EMAIL_VERIFICATION_STEP.url);
  }

  localStorageSet('initialSteps', initialSteps);
  return initialSteps;
}

export function getOnboardingSteps({user, isClient}) {
  if (!user || user.is_onboarding_completed) return [];

  const initialSteps = getInitialSteps({user, isClient});
  const completedSteps = localStorageGet('completedSteps');
  let uncompletedSteps = completedSteps?.length
    ? initialSteps.filter((stepUrl) => !completedSteps.includes(stepUrl))
    : initialSteps;

  if (user.is_email_verified) {
    uncompletedSteps = uncompletedSteps.filter((i) => i !== EMAIL_VERIFICATION_STEP.url);
  }

  return uncompletedSteps;
}

export async function setOnboardingCompleted(user) {
  if (user.is_onboarding_completed) return;

  await updateModel(models.User, user, {is_onboarding_completed: true});

  delete localStorage.isClientSignup;
  delete localStorage.completedSteps;
  delete localStorage.initialSteps;
}

export default function OnboardingPage({className, stepUrl}) {
  const {user, isSuperuser, isClient} = useSelector((state) => getAuthState(state));

  async function updateUser(data) {
    await updateModel(models.User, user, data, {
      errMsg: 'Error saving user data',
    });
  }

  // Remove step from completed when go back
  useEffect(() => {
    const completedSteps = localStorageGet('completedSteps') || [];
    if (completedSteps.includes(stepUrl)) {
      const nextCompletedSteps = completedSteps?.filter((s) => s !== stepUrl);
      localStorageSet('completedSteps', nextCompletedSteps);
    }
  }, [stepUrl]);

  useEffect(() => {
    trackEvent(TRACKING_EVENTS.SHOWN, {type: stepUrl});
  }, [stepUrl]);

  // Dynamic steps. Could be different for users and onboarding sources
  const initialSteps = getInitialSteps({user, isClient});
  const uncompletedSteps = getOnboardingSteps({user, isClient});

  const StepComponent = STEPS_BY_URL[stepUrl];
  if (!StepComponent) return <Redirect to={uncompletedSteps[0] ? `/welcome/${uncompletedSteps[0]}` : '/'} />;

  async function submit() {
    const completedSteps = localStorageGet('completedSteps') || [];
    const uncompletedSteps = getOnboardingSteps({user, isClient});
    if (!completedSteps.includes(stepUrl)) {
      completedSteps.push(stepUrl);
      localStorageSet('completedSteps', completedSteps);
    }

    if (uncompletedSteps[1]) return <censored>History.push(`/welcome/${uncompletedSteps[1]}`);

    await setOnboardingCompleted(user);
    return <censored>History.push(getDashboardUrl());
  }

  async function confirmStep() {
    trackEvent(TRACKING_EVENTS.CONFIRM, {type: stepUrl});
    submit();
  }

  function skipStep() {
    trackEvent(TRACKING_EVENTS.SKIP, {type: stepUrl});
    submit();
  }

  function goBack() {
    trackEvent(TRACKING_EVENTS.BACK, {type: stepUrl});
    <censored>History.goBack();
  }

  return (
    <Page className={className} noSidebar>
      <PageContentSection>
        <ProgressBar progress={(100 * initialSteps.indexOf(stepUrl)) / initialSteps.length} />
        <StepComponent
          user={user}
          updateUser={updateUser}
          confirmStep={confirmStep}
          skipStep={skipStep}
          isSuperuser={isSuperuser}
          noBackButton={initialSteps[0] === stepUrl}
          goBack={goBack}
        />
      </PageContentSection>
    </Page>
  );
}

OnboardingPage.propTypes = {
  className: PropTypes.string.isRequired,
  stepUrl: PropTypes.string,
};

OnboardingPage = styled(OnboardingPage)`
  .onboarding-page {
    width: 100%;
    margin: auto;
  }
  .onboarding-header {
    margin: 0 0 2rem;
    .onboarding-header-title {
      margin: 0 0 0.5rem;
      color: ${(props) => props.theme.colors.primaryText};
      font-weight: ${(props) => props.theme.fonts.weights.book};
    }
    .onboarding-header-subtitle {
      color: ${(props) => props.theme.colors.grayDark};
    }
  }
  @media all and (min-width: ${(props) => props.theme.breakpoints.sm}) {
    .onboarding-page {
      width: 28.75rem;
    }
  }
`;

OnboardingPage.ROUTE_CONFIG = {
  title: 'Welcome',
  pageName: 'Onboarding',
  allowedUserType: AUTH_USER_TYPES.LOGIN,
};
