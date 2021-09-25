import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import cn from 'classnames';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import FormControls from '<censored_path>/ui/components/forms/Controls';
import {updateModel, fetchModel} from '<censored_path>/ui/utils';
import models from '<censored_path>/ui/models';
import SelectOther from '<censored_path>/ui/components/forms/SelectOther';
import Loader from '<censored_path>/ui/components/Loader';
import {COMPANY_TYPES, COMPANY_INDUSTRIES} from '<censored_path>/shared/client_companies/definitions';

export default function AboutCompany({className, user, confirmStep, noBackButton, goBack}) {
  const companyId = user.permission_company?.id;
  const company = useSelector((state) => (state.models.client_companies || {})[companyId]);

  useEffect(() => {
    if (company) return;
    fetchModel(models.Company, companyId);
  }, [company]);

  if (!company) return <Loader />;

  async function onSubmit(data) {
    await updateModel(models.Company, {id: user.permission_company.id}, data);
    confirmStep();
  }

  const typeOptions = [{value: '', display: ''}, ...Object.values(COMPANY_TYPES).map((v) => ({value: v, display: v}))];
  const industryOptions = [
    {value: '', display: ''},
    ...Object.values(COMPANY_INDUSTRIES).map((v) => ({value: v, display: v})),
  ];

  return (
    <div className={cn(className, 'onboarding-page')} data-test="onboardingAboutCompany">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Which best describes your company?</H4>
        <P1 className="onboarding-header-subtitle">
          We use this information to make small customizations to the <censored_text> experience to best meet your needs.
        </P1>
      </div>

      <Form className="responsive-form" onSubmit={onSubmit}>
        <SelectOther
          className="mv-0"
          testSel="companyType"
          name="type"
          label="Company type"
          defaultValue={company.type}
          placeholder="Select a company type"
          options={typeOptions}
          isRequired
        />
        <SelectOther
          className="mv-0"
          testSel="companyIndustry"
          name="industry"
          label="Industry"
          defaultValue={company.industry}
          placeholder="Select an industry"
          options={industryOptions}
          isRequired
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

AboutCompany.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  confirmStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  noBackButton: PropTypes.bool,
};
