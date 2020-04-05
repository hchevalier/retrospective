class RetrospectivesController < ApplicationController
  def new; end

  def create
    organizer = Participant.new(organizer_params)
    retrospective = Retrospective.create(retrospective_params.merge(participants: [organizer]))
    if retrospective
      cookies.signed[:user_id] = organizer.id
      render json: { id: retrospective.id }
    else
      render json: { status: :unprocessable_entity, errors: retrospective.errors }
    end
  end

  def show
    @retrospective = Retrospective.find(params[:id])
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

