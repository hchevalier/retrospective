# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :ensure_logged_in

  AUTHORIZED_DOMAINS =
    (Rails.configuration.authentication[:domains_allowlist] || '').split(';').map { |domain| "@#{domain}" }.freeze

  def current_participant
    @current_participant ||= begin
      if (participant_id = cookies.signed[:participant_id])
        Participant.find(participant_id)
      end
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
    @current_account ||= (Account.includes(:groups).find(session[:account_id]) if session[:account_id])
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

  def google_authentication_enabled?
    Rails.configuration.authentication[:google_client_id].present?
  end
  helper_method :google_authentication_enabled?
end
