# frozen_string_literal: true

class ParticipantsController < ApplicationController
  def create
    retrospective = Retrospective.find(params[:retrospective_id])

    participant = retrospective.participants.find { |existing| existing.account_id == current_account.id }
    participant ||= Participant.create!(
      surname: current_account.username,
      account_id: current_account.id,
      retrospective: retrospective
    )
    retrospective.group.add_member(current_account)

    cookies.signed[:participant_id] = participant.id
    participant.join

    additionnal_info = { step: retrospective.step }

    render json: { profile: participant.full_profile, additionnal_info: additionnal_info }
  end

  def update
    retrospective = current_participant.retrospective
    participant = Participant.find(params[:id])
    if current_participant != participant || retrospective != participant.retrospective
      return render(json: { status: :forbidden })
    end

    if params[:color] && current_participant.update!(update_participants_params)
      broadcast_change_color(retrospective, current_participant.profile)

      render json: { status: :ok }
    elsif params[:zone_id] && params[:emotion]
      current_data = current_participant.retrospective_related_data
      current_data['emotions'] ||= {}
      current_data['emotions'].merge!(params[:zone_id] => params[:emotion])
      current_participant.update!(retrospective_related_data: current_data)
      broadcast_facilitator_info(retrospective)

      render json: { status: :ok }
    else
      render json: { status: :unprocessable_entity }
    end
  end

  private

  def update_participants_params
    params.permit(:color)
  end

  def broadcast_facilitator_info(retrospective)
    retrospective.broadcast_order('updateFacilitatorInfo', { facilitatorInfo: retrospective.facilitator_info })
  end

  def broadcast_change_color(retrospective, profile)
    parameters = {
      participant: profile,
      availableColors: retrospective.available_colors
    }
    retrospective.broadcast_order('changeColor', parameters)
  end
end
