class SessionsController < ApplicationController
  include ApplicationHelper

  skip_before_action :ensure_logged_in, only: %i(new create omniauth)

  def new; end

  def create
    account = Account.find_by(email: params[:email])
    return render(json: { status: :not_found }, status: :not_found) unless account

    return render(json: { status: :unauthorized }, status: :unauthorized) unless account unless account.authenticate(params[:password])

    session[:account_id] = account.id
    consume_invitation(account) if session[:invitation]

    return :head
  end

  def destroy
    session[:account_id] = nil
    cookies.signed[:participant_id] = nil
    redirect_to :new_sessions
  end

  def omniauth
    account = Account.from_omniauth(auth)
    account.save!

    session[:account_id] = account.id

    redirect_to single_page_app_path(path: :dashboard)
  end

  private

  def auth
    request.env['omniauth.auth']
  end
end
