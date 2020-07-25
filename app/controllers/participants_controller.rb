class ParticipantsController < ApplicationController
  def create
    retrospective = Retrospective.find(params[:retrospective_id])

    participant = retrospective.participants.find { |participant| participant.account_id == current_account.id }
    participant ||= Participant.create!(
      surname: current_account.username,
      account_id: current_account.id,
      retrospective: retrospective
    )
    retrospective.group.add_member(current_account)

    cookies.signed[:user_id] = participant.id
    participant.join

    additionnal_info = { step: retrospective.step }

    render json: { profile: participant.full_profile, additionnal_info: additionnal_info }
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

  def update_participants_params
    params.permit(:color)
  end
end
