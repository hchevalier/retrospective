class SessionsController < ApplicationController
  skip_before_action :ensure_logged_in

  def new; end

  def create
    account = Account.find_by(email: params[:email])
    return render(:not_found) unless account

    redirect_to :back unless account.authenticate(params[:password])

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
