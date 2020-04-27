class RetrospectivesController < ApplicationController
  before_action :http_authenticate
  before_action :preload_current_user_and_relationships, only: :show

  def new; end

  def create
    retrospective = Retrospective.create(retrospective_params.merge(organizer_attributes: organizer_params))

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

    @initial_state = @retrospective.initial_state(current_user)

    if current_user
      @participant = current_user
      @participant.join

      @initial_state.merge!(profile: current_user.profile)
    end
  end

  private

  def retrospective_params
    params.require(:retrospective).permit(:name, :kind)
  end

  def organizer_params
    params.require(:organizer).permit(:surname, :email)
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
