class RetrospectivesController < ApplicationController
  before_action :http_authenticate
  before_action :preload_current_user_and_relationships, only: :show
  skip_before_action :ensure_logged_in, only: :show

  def new; end

  def create
    retrospective = Retrospective.create(retrospective_params.merge(organizer_attributes: organizer_attributes))

    if retrospective.persisted?
      cookies.signed[:user_id] = retrospective.organizer_id
      render json: { id: retrospective.id }
    else
      render json: { status: :unprocessable_entity, errors: retrospective.errors }
    end
  end

  def show
    @retrospective =
      current_user&.retrospective_id == params[:id] ?
      current_user.retrospective :
      Retrospective.includes(:participants, :zones).find(params[:id])

    if current_account
      participant = @retrospective.participants.find { |participant| participant.account == current_account }

      cookies.signed[:user_id] = participant.id if participant && current_user&.id != participant.id
    end

    @initial_state = @retrospective.initial_state(current_user)

    if current_user && current_user.account == current_account
      @participant = current_user
      @participant.join

      @initial_state.merge!(profile: current_user.full_profile)
    end
  end

  private

  def retrospective_params
    params.permit(:name, :kind)
  end

  def organizer_attributes
    { surname: current_account.username, account_id: current_account.id }
  end

  def preload_current_user_and_relationships
    current_user_with_relationships_included
  end

  def http_authenticate
    return true unless Rails.env.production?

    authenticate_or_request_with_http_basic do |username, password|
      username == ENV.fetch('BASIC_AUTH_USERNAME') && password == ENV.fetch('BASIC_AUTH_PASSWORD')
    end
  end
end
