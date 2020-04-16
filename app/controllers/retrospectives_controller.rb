class RetrospectivesController < ApplicationController
  http_basic_authenticate_with name: ENV.fetch('BASIC_AUTH_USERNAME'), password: ENV.fetch('BASIC_AUTH_PASSWORD')

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
      Retrospective.includes(:participants, :zones, reflections: [:zone, :reactions, owner: :organized_retrospective]).find(params[:id])

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
end
