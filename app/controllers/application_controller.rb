class ApplicationController < ActionController::Base
  def current_user
    @current_user ||= begin
      (user_id = cookies.signed[:user_id]) ?
      Participant.find(user_id) :
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
    return if current_user

    render json: { status: :unauthorized }
  end
end
