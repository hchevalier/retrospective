class AccountsController < ApplicationController
  skip_before_action :ensure_logged_in, only: :create

  def create
    account = Account.create(account_params)

    redirect_to :back unless account

    session[:account_id] = account.id
    consume_invitation(account) if session[:invitation]

    render json: :created
  end

  private

  def account_params
    params.permit(:email, :username, :password)
  end
end
