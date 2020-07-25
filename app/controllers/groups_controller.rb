class GroupsController < ApplicationController
  def index
    render json: current_account.accessible_groups.map(&:as_short_json)
  end

  def create
    group = Group.create!(name: params[:name])
    group.add_member(current_account)

    render json: group.as_short_json
  end

  def show
    group = current_account.accessible_groups.find_by(id: params[:id])
    return render(json: { status: :not_found }) unless group

    render json: group.as_json(current_account)
  end

  def update_task
    group = current_account.accessible_groups.find_by(id: params[:id])
    return render(json: { status: :not_found }) unless group

    task = group.tasks_visible_by(current_account).find { |task| task.id == params[:task_id] }
    return render(json: { status: :not_found }) unless task

    task.update!(update_task_params)
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'updateTask', parameters: { task: task.as_json })

    render json: task.as_json
  end

  private

  def update_task_params
    params.permit(:status)
  end
end
