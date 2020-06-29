class ApplicationController < ActionController::Base
  before_action :ensure_logged_in

  def current_user
    @current_user ||= begin
      (user_id = cookies.signed[:user_id]) ?
      Participant.find(user_id) :
      nil
    end
  end

  def reload_current_user
    @current_user = nil
    current_user
  end

  def current_account
    @current_account ||= begin
      (account_id = session[:account_id]) ?
      Account.includes(:groups).find(account_id) :
      nil
    end
  end

  def current_user_with_relationships_included
    @current_user ||= begin
      (user_id = cookies.signed[:user_id]) ?
      Participant.includes(retrospective: [:participants, :zones]).find(user_id) :
      nil
    end
  end

  def ensure_logged_in
    redirect_to :new_sessions unless current_account
  end

  def ensure_participant
    return if current_user

    render json: { status: :unauthorized }
  end
end
