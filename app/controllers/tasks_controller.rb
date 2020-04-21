class TasksController < ApplicationController
  before_action :ensure_logged_in

  def create
    retrospective = Retrospective.find(params[:id])
    return render(json: { error: :forbidden }) unless current_user.retrospective_id == retrospective.id
    return render(json: { error: :not_found }) unless retrospective.reflections.find_by(id: params[:reflection_id])

    task = current_user.created_tasks.create!(task_params)
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'addTask', parameters: { task: task.as_json })

    render json: task.as_json
  end

  private

  def task_params
    params.permit(:assignee_id, :reflection_id, :title, :description, :status)
  end
end
