class ParticipantsController < ApplicationController
  def create
    participant = Participant.create!(participants_params)

    if participant
      cookies.signed[:user_id] = participant.id
      render json: {}
    else
      render json: { status: 422, errors: participant.errors }
    end
  end

  private

  def participants_params
    params.permit(:surname, :email, :retrospective_id)
  end
end
