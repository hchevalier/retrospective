class RetrospectivesController < ApplicationController
  def new; end

  def create
    organizer = Participant.new(organizer_params)
    retrospective = Retrospective.create(retrospective_params.merge(participants: [organizer]))
    if retrospective
      render json: { id: retrospective.id }
    else
      render json: { status: 422, errors: retrospective.errors }
    end
  end

  def show
    @retrospective = Retrospective.find(params[:id])
  end

  private

  def retrospective_params
    params.require(:retrospective).permit(:name, :kind)
  end

  def organizer_params
    params.require(:organizer).permit(:surname, :email)
  end
end

