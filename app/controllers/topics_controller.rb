class TopicsController < ApplicationController
  before_action :ensure_participant

  def create
    reflection_ids = [params[:target_reflection_id], params[:dropped_reflection_id]]
    reflections = current_user.retrospective.reflections.where(id: reflection_ids)
    return(render json: { status: :unprocessable_entity }) unless reflections.size == 2

    previous_topic = reflections.find { |reflection| reflection.id == params[:dropped_reflection_id] }.topic

    current_user.retrospective.topics.create(reflections: reflections)
    reflections.each do |reflection|
      OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflection.readable })
    end

    clean_orphans(previous_topic) if previous_topic

    render json: :created
  end

  def update
    reflection = current_user.retrospective.reflections.find(params[:reflection_id])
    previous_topic = reflection.topic

    topic = current_user.retrospective.topics.find(params[:id])
    topic.reflections << reflection
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflection.reload.readable })

    clean_orphans(previous_topic) if previous_topic

    render json: :ok
  end

  private

  def clean_orphans(topic)
    remaining_reflections = topic.reflections
    return unless remaining_reflections.size <= 1

    topic.destroy
    lone_reflection = remaining_reflections.first
    lone_reflection.update(topic_id: nil)

    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: lone_reflection.reload.readable })
  end
end
