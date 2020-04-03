class ParticipantsController < ApplicationController
  def create
    retrospective = Retrospective.find(params[:id])
    participant = Participant.create!(participants_params.merge(retrospective: retrospective))

    if participant
      cookies.signed[:user_id] = participant.id
      participant.join
      render json: participant.profile
    else
      render json: { status: :unprocessable_entity, errors: participant.errors }
    end
  end

  private

  def participants_params
    params.permit(:surname, :email)
  end
end
