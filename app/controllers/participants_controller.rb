class ParticipantsController < ApplicationController
  def create
    participant = Participant.create!(participants_params)

    if participant
      cookies.signed[:user_id] = participant.id
      participant.join
      render json: participant.profile # TODO: return list of already present participants
    else
      render json: { status: 422, errors: participant.errors }
    end
  end

  private

  def participants_params
    params.permit(:surname, :email, :retrospective_id)
  end
end
