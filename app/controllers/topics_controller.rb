# frozen_string_literal: true

class TopicsController < ApplicationController
  before_action :ensure_participant

  # rubocop:todo Metrics/AbcSize
  def create
    reflection_ids = [params[:target_reflection_id], params[:dropped_reflection_id]]
    reflections = current_participant.retrospective.reflections.where(id: reflection_ids).includes(:topic)
    return(render json: { status: :unprocessable_entity }) unless reflections.size == 2

    dropped = reflections.find { |reflection| reflection.id == params[:dropped_reflection_id] }
    target = reflections.find { |reflection| reflection != dropped }
    previous_topic = dropped.topic

    current_participant.retrospective.topics.create(reflections: reflections)
    dropped.update!(zone_id: target.zone_id)

    reflections.each do |reflection|
      broadcast_change_topic(current_participant.retrospective, { reflection: reflection.readable })
    end

    clean_orphans(previous_topic) if previous_topic

    render json: :created
  end

  def update
    topic = current_participant.retrospective.topics.find(params[:id])

    if params[:reflection_id]
      reflection = current_participant.retrospective.reflections.find(params[:reflection_id])
      previous_topic = reflection.topic

      if params[:remove]
        reflection.update(topic: nil)
      else
        zone_id = topic.reflections.first.zone_id
        topic.reflections << reflection
        reflection.update!(zone_id: zone_id) if reflection.zone_id != zone_id
      end

      broadcast_change_topic(current_participant.retrospective, { reflection: reflection.reload.readable })
      clean_orphans(previous_topic) if previous_topic
    else
      topic.update(topic_params)
      broadcast_change_topic(current_participant.retrospective, { topic: topic.as_json })
    end

    render json: topic.as_json
  end
  # rubocop:enable Metrics/AbcSize

  private

  def topic_params
    params.permit(:label)
  end

  def clean_orphans(topic)
    remaining_reflections = topic.reflections
    return unless remaining_reflections.size <= 1

    lone_reflection = remaining_reflections.first
    topic.destroy
    return unless lone_reflection

    lone_reflection.update(topic_id: nil)
    broadcast_change_topic(current_participant.retrospective, { reflection: lone_reflection.reload.readable })
  end

  def broadcast_change_topic(retrospective, parameters)
    retrospective.broadcast_order('changeTopic', parameters)
  end
end
