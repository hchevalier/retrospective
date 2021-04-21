import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import StepGathering from './StepGathering'
import StepReview from './StepReview'
import StepThinking from './StepThinking'
import StepGrouping from './StepGrouping'
import StepVoting from './StepVoting'
import StepVotingWithEmotions from './StepVotingWithEmotions'
import StepActions from './StepActions'
import StepDone from './StepDone'
import TopicExpanded from './TopicExpanded'

const RetrospectiveArea = ({ kind, onToggleFullScreen, fullScreen }) => {
  const currentStep = useSelector(state => state.orchestrator.step)

  const [expandedTopic, setExpandedTopic] = useState(null)
  const [forceTopicEditing, setForceTopicEditing] = useState(false)

  const handleExpandTopic = (topic, forceEditing = false) => {
    setExpandedTopic(topic)
    setForceTopicEditing(forceEditing)
  }

  const handleCollapseTopic = () => {
    setExpandedTopic(null)
    setForceTopicEditing(false)
  }

  return (
    <div id={kind} className='h-full'>
      {currentStep === 'gathering' && <StepGathering />}
      {currentStep === 'reviewing' && <StepReview />}
      {currentStep === 'thinking' && <StepThinking kind={kind} onToggleFullScreen={onToggleFullScreen} fullScreen={fullScreen} />}
      {currentStep === 'grouping' && <StepGrouping onExpandTopic={handleExpandTopic} onToggleFullScreen={onToggleFullScreen} fullScreen={fullScreen} />}
      {currentStep === 'voting' && kind === 'timeline' && <StepVotingWithEmotions onExpandTopic={handleExpandTopic} />}
      {currentStep === 'voting' && kind !== 'timeline' && <StepVoting onExpandTopic={handleExpandTopic} />}
      {currentStep === 'actions' && <StepActions />}
      {currentStep === 'done' && <StepDone />}
      {expandedTopic && (
        <TopicExpanded
          topic={expandedTopic}
          editable={currentStep === 'grouping'}
          forceTopicEditing={forceTopicEditing}
          onCollapseTopic={handleCollapseTopic}
          onTopicChange={handleExpandTopic} />
      )}
    </div>
  )
}

RetrospectiveArea.propTypes = {
  kind: PropTypes.string,
  fullScreen: PropTypes.bool,
  onToggleFullScreen: PropTypes.func
}

export default RetrospectiveArea
