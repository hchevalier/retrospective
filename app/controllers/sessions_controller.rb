class SessionsController < ApplicationController
  skip_before_action :ensure_logged_in

  def new; end

  def create
    account = Account.find_by(email: params[:email])
    return render(json: { status: :not_found }) unless account

    return render(json: { status: :unauthorized }) unless account unless account.authenticate(params[:password])

    session[:account_id] = account.id

    redirect_to dashboard_path
  end

  def omniauth
    account = Account.from_omniauth(auth)
    account.save!

    session[:account_id] = account.id

    redirect_to dashboard_path
  end

  private

  def auth
    request.env['omniauth.auth']
  end
end
