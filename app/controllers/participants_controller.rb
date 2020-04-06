class ParticipantsController < ApplicationController
  def create
    retrospective = Retrospective.find(params[:id])
    participant = Participant.create!(participants_params.merge(retrospective: retrospective))

    if participant
      cookies.signed[:user_id] = participant.id
      participant.join

      additionnal_info = {}
      if retrospective.timer_end_at && (remaining_time = retrospective.timer_end_at - Time.now ) > 0
        additionnal_info = {
          timerDuration: remaining_time,
          lastTimerReset: Time.now.to_i
        }
      end

      render json: { profile: participant.profile, additionnal_info: additionnal_info }
    else
      render json: { status: :unprocessable_entity, errors: participant.errors }
    end
  end

  private

  def participants_params
    params.permit(:surname, :email)
  end
end
