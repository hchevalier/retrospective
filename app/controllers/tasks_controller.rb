class TasksController < ApplicationController
  before_action :ensure_logged_in

  def create
    retrospective = Retrospective.find(params[:id])
    return render(json: { error: :forbidden }) unless current_user.retrospective_id == retrospective.id

    task = current_user.created_tasks.create!(task_params)
    #TODO: broadcast task

    render json: task.as_json
  end

  private

  def task_params
    params.permit(:assignee_id, :title, :description, :status)
  end
end
