class TopicsController < ApplicationController
  before_action :ensure_participant

  def create
    reflection = current_user.retrospective.reflections.find(params[:reflection_id])
    topic = Topic.create(reflections: [reflection])

    render json: topic.as_json
  end
end
