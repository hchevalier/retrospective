# frozen_string_literal: true

class AccountsController < ApplicationController
  skip_before_action :ensure_logged_in, only: :create

  def create
    account = Account.new(account_params)
    account.save if valid_email?(account.email)

    return render(json: { status: :forbidden }, status: :forbidden) unless account.persisted?

    session[:account_id] = account.id

    render json: :created
  end

  private

  def account_params
    params.permit(:email, :username, :password)
  end
end
