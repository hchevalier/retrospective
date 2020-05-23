class PasswordResetController < ApplicationController
  skip_before_action :ensure_logged_in

  def create
    account = Account.find_by(email: params[:email])

    return render(json: { status: :created }) unless account

    account.regenerate_password_reset_token
    AccountMailer.send_password_reset.deliver_later

    render(json: { status: :created })
  end

  def show; end

  def update
    return render(json: { status: :unprocessable_entity }) unless params[:id]

    account = Account.find_by(password_reset_token: params[:id])
    return render(json: { status: :ok }) unless account

    account.update!(password: params[:password], password_confirmation: params[:password], password_reset_token: nil)

    render(json: { status: :created })
  end

  private

  def account_params
    params.permit(:email, :username, :password)
  end
end
