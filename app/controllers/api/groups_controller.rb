# frozen_string_literal: true

class Api::GroupsController < ApplicationController
  def index
    render json: current_account.accessible_groups.map(&:as_short_json)
  end

  def create
    group = Group.create!(name: params[:name])
    group.add_member(current_account)

    render json: group.as_short_json
  end

  def update
    group = current_account.accessible_groups.find_by(id: params[:id])
    return render(json: { status: :not_found }) unless group

    group.update!(group_params)

    render json: :ok
  end

  def show
    group =
      current_account
        .accessible_groups
        .includes(
          :accounts_without_revoked,
          :pending_invitations,
          :retrospectives,
          tasks: [:author, :assignee, :retrospective, reflection: :zone]
        )
        .find_by(id: params[:id])

    return render(json: { status: :not_found }) unless group

    render json: group.as_json(current_account)
  end

  private

  def group_params
    params.permit(:next_retrospective)
  end
end
