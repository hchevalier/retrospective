# frozen_string_literal: true

class TasksController < ApplicationController
  before_action :ensure_participant, except: :index

  def index
    group_ids = current_account.accessible_groups.ids
    tasks =
      current_account
        .assigned_tasks
        .includes(:retrospective, :assignee, author: :retrospective, reflection: :zone)
        .where(retrospectives: { group_id: group_ids })
        .select(&:pending?)
        .map(&:as_json)
        .sort_by { |task| task[:createdAt] }
        .reverse

    render json: tasks
  end

  def create
    retrospective = current_participant.retrospective
    return render(json: { status: :not_found }) unless retrospective.reflections.find_by(id: params[:reflection_id])

    task = current_participant.created_tasks.create!(task_params)
    retrospective.broadcast_order('addTask', { task: task.as_json })

    render json: task.as_json
  end

  def update
    retrospective = current_participant.retrospective
    case retrospective.step
    when 'actions'
      task = retrospective.tasks.find_by(id: params[:id])
      return render(json: { status: :not_found }) unless task

      task.update!(actions_step_update_task_params)
    when 'reviewing'
      task =
        current_account
          .visible_tasks_from_group(retrospective.group)
          .find { |visible_task| visible_task.id == params[:id] }
      return render(json: { status: :not_found }) unless task

      task.update!(reviewing_step_update_task_params)
    end

    retrospective.broadcast_order('updatePendingTask', { task: task.as_json })

    render json: task.as_json
  end

  def destroy
    retrospective = Retrospective.find(params[:retrospective_id])
    task = retrospective.tasks.find_by(id: params[:id])
    return render(json: { status: :not_found }) unless task

    task.destroy!
    current_participant.retrospective.broadcast_order('dropTask', { taskId: task.id })

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
    params.permit(:assignee_id, :status)
  end
end
