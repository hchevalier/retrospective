class AccountsController < ApplicationController
  skip_before_action :ensure_logged_in, only: :create

  def create
    account = Account.create(account_params)

    redirect_to :back unless account

    session[:account_id] = account.id

    render json: :created
  end

  private

  def account_params
    params.permit(:email, :username, :password, :password_confirmation)
  end
end