class Api::AccountsController < ApplicationController
  def show
    render json: current_account.as_json and return if current_account

    render json: { status: :unauthorized }, status: :unauthorized
  end
end
