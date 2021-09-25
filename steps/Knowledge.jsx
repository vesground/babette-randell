import React, {useState} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {H4, P1} from '<censored_path>/ui/components/text';
import Form from '<censored_path>/ui/components/forms/Form';
import {Button} from '<censored_path>/ui/components';
import Icon from '<censored_path>/ui/components/Icon';
import KnowledgeAreaPicker from '<censored_path>/ui/components/KnowledgeAreaPicker';
import userActions from '<censored_path>/ui/model_actions/users';
import ProjectsSampleModal from '<censored_path>/ui/components/modals/ProjectsSample';
import FormControls from '<censored_path>/ui/components/forms/Controls';

export default function Knowledge({user, confirmStep, skipStep, noBackButton, goBack}) {
  const [isProjectsSampleModalOpen, setIsProjectsSampleModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <H4 className="onboarding-header-title">Share what you know</H4>
        <P1 className="onboarding-header-subtitle">
          <censored_text> uses knowledge tags to help you get discovered for what you know best. A way to think about these
          is, “What professional topics do people tend to ask me about most?”
        </P1>
        <ProjectsSampleModal isOpen={isProjectsSampleModalOpen} onClose={() => setIsProjectsSampleModalOpen(false)} />
        <Button color={Button.STYLES.MINIMAL} onClick={() => setIsProjectsSampleModalOpen(true)}>
          View examples
        </Button>
      </div>
      <Form className="responsive-form onboarding-user-knowledge-areas" onSubmit={confirmStep}>
        <KnowledgeAreaPicker
          value={user.knowledge_areas}
          placeholder={user.knowledge_areas?.length ? 'Add another knowledge tag...' : 'Add a knowledge tag...'}
          label="Knowledge tags"
          onChange={(knowledgeAreas, options) => {
            setHasSubmitted(true);
            userActions.setKnowledgeAreas(user, knowledgeAreas, {
              trackEventName: 'user_knowledgeTagSubmitted',
              trackEventSource: 'onboarding',
              ...options,
            });
          }}
        />
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
          <Button type="submit" disabled={!hasSubmitted}>
            Continue
          </Button>
        </FormControls>
      </Form>
    </div>
  );
}

Knowledge.propTypes = {
  user: PropTypes.object.isRequired,
  noBackButton: PropTypes.bool,
  confirmStep: PropTypes.func.isRequired,
  skipStep: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};
