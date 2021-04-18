# frozen_string_literal: true

module TopicsHelper
  def clean_orphans(topic)
    remaining_reflections = topic.reflections
    return unless remaining_reflections.size <= 1

    lone_reflection = remaining_reflections.first
    topic.destroy
    return unless lone_reflection

    lone_reflection.update(topic_id: nil)
    broadcast_change_topic(current_participant.retrospective, { reflection: lone_reflection.reload.readable })
  end

  private

  def broadcast_change_topic(retrospective, parameters)
    retrospective.broadcast_order('changeTopic', parameters)
  end
end
