class GroupsController < ApplicationController
  before_action :ensure_logged_in

  def index
    render json: current_account.accessible_groups.map(&:as_json)
  end

  def create
    group = Group.create!(name: params[:name])
    group.accounts << current_account

    render json: :created
  end
end
