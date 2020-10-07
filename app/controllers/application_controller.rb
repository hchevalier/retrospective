class ApplicationController < ActionController::Base
  before_action :ensure_logged_in

  def current_participant
    @current_participant ||= begin
      (participant_id = cookies.signed[:participant_id]) ?
      Participant.find(participant_id) :
      nil
    end
  end

  def reload_current_participant
    @current_participant = nil
    current_participant
  end

  def current_account
    @current_account ||= begin
      (account_id = session[:account_id]) ?
      Account.includes(:groups).find(account_id) :
      nil
    end
  end

  def current_participant_with_relationships_included
    @current_participant ||= begin
      (participant_id = cookies.signed[:participant_id]) ?
      Participant.includes(retrospective: [:participants, :zones]).find(participant_id) :
      nil
    end
  end

  def ensure_logged_in
    return if current_account

    respond_to do |format|
      format.json { render(json: { status: :unauthorized }) }
      format.html { redirect_to :new_sessions }
    end
  end

  def ensure_participant
    return if current_participant

    render json: { status: :unauthorized }
  end
end
