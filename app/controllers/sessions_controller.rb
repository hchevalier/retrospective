# frozen_string_literal: true

class SessionsController < ApplicationController
  skip_before_action :ensure_logged_in, only: %i[create omniauth]

  def create
    account = Account.find_by(email: params[:email])
    return render(json: { status: :not_found }, status: :not_found) unless account

    return render(json: { status: :unauthorized }, status: :unauthorized) unless account.authenticate(params[:password])

    session[:account_id] = account.id

    :head
  end

  def destroy
    session[:account_id] = nil
    cookies.signed[:participant_id] = nil
    redirect_to single_page_app_path(path: 'sessions/new')
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
