# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :ensure_logged_in

  AUTHORIZED_DOMAINS = ENV.fetch('DOMAINS_WHITELIST', '').split(';').map { |domain| "@#{domain}" }.freeze

  def current_participant
    @current_participant ||= begin
      (participant_id = cookies.signed[:participant_id]) ?
      Participant.find(participant_id) :
      nil
    rescue ActiveRecord::RecordNotFound
      cookies.signed[:participant_id] = nil
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
      Participant.includes(retrospective: %i[participants zones]).find(participant_id) :
      nil
    end
  end

  def ensure_logged_in
    return if current_account

    respond_to do |format|
      format.json { render(json: { status: :unauthorized }) }
      format.html { redirect_to single_page_app_path(path: 'sessions/new') }
    end
  end

  def ensure_participant
    return if current_participant

    render json: { status: :unauthorized }
  end

  def valid_email?(email)
    return true unless AUTHORIZED_DOMAINS.any?

    AUTHORIZED_DOMAINS.any? { |domain| email.ends_with?(domain) }
  end
end
