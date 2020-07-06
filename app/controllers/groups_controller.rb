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
end
