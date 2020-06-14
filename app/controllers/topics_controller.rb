class TopicsController < ApplicationController
  before_action :ensure_participant

  def create
    reflection_ids = [params[:first_reflection_id], params[:second_reflection_id]]
    reflections = current_user.retrospective.reflections.where(id: reflection_ids)
    return(render json: { status: :unprocessable_entity }) unless reflections.size == 2

    topic = Topic.create(reflections: reflections)
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflections.first.readable })
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflections.last.readable })

    render json: :created
  end

  def update
    reflection = current_user.retrospective.reflections.find(params[:reflection_id])
    previous_topic = reflection.topic

    topic = Topic.find(params[:id]) # TODO: make sure that topic is bound to the correct retrospective
    topic.reflections << reflection
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflection.reload.readable })

    previous_topic.delete if previous_topic.reflections.none?
  end
end
