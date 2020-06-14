class TopicsController < ApplicationController
  before_action :ensure_participant

  def create
    reflection_ids = [params[:first_reflection_id], params[:second_reflection_id]]
    reflections = current_user.retrospective.reflections.where(id: reflection_ids)
    return(render json: { status: :unprocessable_entity }) unless reflections.size == 2

    topic = Topic.create(reflections: reflections)
    reflections.each do |reflection|
      OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflection.readable })
    end

    render json: :created
  end

  def update
    reflection = current_user.retrospective.reflections.find(params[:reflection_id])
    previous_topic = reflection.topic

    topic = Topic.find(params[:id])
    retrospective = topic.reflections.first.retrospective
    return(render json: { status: :unauthorized }) unless retrospective == current_user.retrospective

    topic.reflections << reflection
    OrchestratorChannel.broadcast_to(retrospective, action: 'changeTopic', parameters: { reflection: reflection.reload.readable })

    previous_topic.delete if previous_topic.reflections.none?
  end
end
