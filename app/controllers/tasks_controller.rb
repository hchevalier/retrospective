class TasksController < ApplicationController
  before_action :ensure_participant, except: :index

  def index
    group_ids = current_account.accessible_groups.ids
    participants = current_account.participants.joins(:retrospective).where(retrospectives: { group_id: group_ids })
    tasks =
      participants
        .flat_map(&:assigned_tasks)
        .select(&:todo?)
        .map(&:as_json)
        .sort_by { | task | task[:createdAt] }
        .reverse

    render json: tasks
  end

  def create
    retrospective = current_user.retrospective
    return render(json: { status: :not_found }) unless retrospective.reflections.find_by(id: params[:reflection_id])

    task = current_user.created_tasks.create!(task_params)
    OrchestratorChannel.broadcast_to(retrospective, action: 'addTask', parameters: { task: task.as_json })

    render json: task.as_json
  end

  def update
    retrospective = current_user.retrospective
    if retrospective.step == 'actions'
      task = retrospective.tasks.find_by(id: params[:id])
      return render(json: { status: :not_found }) unless task

      task.update!(actions_step_update_task_params)
    elsif retrospective.step == 'reviewing'
      task = retrospective.group.tasks_visible_by(current_account).find { |task| task.id == params[:id] }
      return render(json: { status: :not_found }) unless task

      task.update!(reviewing_step_update_task_params)
    end

    OrchestratorChannel.broadcast_to(retrospective, action: 'updatePendingTask', parameters: { task: task.as_json })

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

  def actions_step_update_task_params
    params.permit(:assignee_id, :description)
  end

  def reviewing_step_update_task_params
    params.permit(:status)
  end
end
