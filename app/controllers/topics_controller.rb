class TopicsController < ApplicationController
  before_action :ensure_participant

  def create
    reflection_ids = [params[:first_reflection_id], params[:second_reflection_id]]
    reflections = current_user.retrospective.reflections.where(id: reflection_ids)
    return(render json: { status: :unprocessable_entity }) unless reflections.size == 2

    topic =  current_user.retrospective.topics.create(reflections: reflections)
    reflections.each do |reflection|
      OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflection.readable })
    end

    render json: :created
  end

  def update
    reflection = current_user.retrospective.reflections.find(params[:reflection_id])
    previous_topic = reflection.topic

    topic = current_user.retrospective.topics.find(params[:id])
    topic.reflections << reflection
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'changeTopic', parameters: { reflection: reflection.reload.readable })

    previous_topic.delete if previous_topic && previous_topic.reflections.none?
    return(render json: :ok)
  end
end
