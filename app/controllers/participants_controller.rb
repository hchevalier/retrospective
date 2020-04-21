class ParticipantsController < ApplicationController
  def create
    retrospective = Retrospective.find(params[:retrospective_id])
    participant = Participant.create!(participants_params.merge(retrospective: retrospective))

    if participant
      cookies.signed[:user_id] = participant.id
      participant.join

      additionnal_info = { step: retrospective.step }
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

  def update
    retrospective = current_user.retrospective
    participant = Participant.find(params[:id])
    return render(json: { status: :forbidden }) if current_user != participant || retrospective != participant.retrospective

    if current_user.update!(update_participants_params)
      OrchestratorChannel.broadcast_to(
        retrospective,
        action: 'changeColor',
        parameters: {
          participant: current_user.profile,
          availableColors: retrospective.available_colors
        }
      )

      render json: { status: :ok }
    else
      render json: { status: :unprocessable_entity }
    end
  end

  private

  def participants_params
    params.permit(:surname, :email)
  end

  def update_participants_params
    params.permit(:color)
  end
end
