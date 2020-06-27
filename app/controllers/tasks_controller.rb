class TasksController < ApplicationController
  before_action :ensure_logged_in, only: :index
  before_action :ensure_participant, except: :index

  def index
    group_ids = current_account.accessible_groups.ids
    participants = current_account.participants.joins(:retrospective).where(retrospectives: { group_id: group_ids })
    render json: participants.flat_map(&:assigned_tasks).map(&:as_json).sort_by { | task | task[:createdAt] }.reverse
  end

  def create
    retrospective = Retrospective.find(params[:retrospective_id])
    return render(json: { status: :forbidden }) unless current_user.retrospective_id == retrospective.id
    return render(json: { status: :not_found }) unless retrospective.reflections.find_by(id: params[:reflection_id])

    task = current_user.created_tasks.create!(task_params)
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'addTask', parameters: { task: task.as_json })

    render json: task.as_json
  end

  def update
    retrospective = Retrospective.find(params[:retrospective_id])
    task = retrospective.tasks.find_by(id: params[:id])
    return render(json: { status: :not_found }) unless task

    task.update!(update_task_params)
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'updateTask', parameters: { task: task.as_json })

    render json: task.as_json
  end

  def destroy
    retrospective = Retrospective.find(params[:retrospective_id])
    task = retrospective.tasks.find_by(id: params[:id])
    return render(json: { status: :not_found }) unless task

    task.destroy!
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'dropTask', parameters: { taskId: task.id })

    render json: { status: :ok }
  end

  private

  def task_params
    params.permit(:assignee_id, :reflection_id, :description)
  end

  def update_task_params
    params.permit(:assignee_id, :description)
  end
end
