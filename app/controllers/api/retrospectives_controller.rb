# frozen_string_literal: true

class Api::RetrospectivesController < ApplicationController
  def index
    group_ids = current_account.accessible_groups.ids
    retrospectives = (
      current_account.retrospectives.includes(:group).where(group_id: group_ids) +
      Retrospective.includes(:group).where(group_id: group_ids).where('created_at > ?', 90.minutes.ago)
    ).uniq

    render json: retrospectives.map(&:as_short_json).sort_by { |retrospective| retrospective[:createdAt] }.reverse
  end

  def show
    retrospective = Retrospective.includes(:participants).find(params[:id])
    exisiting_participant =
      retrospective.participants.find { |participant| participant.account == current_account }

    using_participant = current_participant&.id
    if exisiting_participant && using_participant != exisiting_participant.id
      # Change participant for current account to this retrospective's one
      cookies.signed[:participant_id] = using_participant = exisiting_participant.id
    elsif !exisiting_participant
      # User don't have a participant for this retrospective yet
      if retrospective.step == 'done' || !current_account.accessible_groups.find_by(id: retrospective.group_id)
        # retrospective is already done or no active access to the group
        cookies.signed[:participant_id] = nil if using_participant
        return render(json: { status: :forbidden }, status: :forbidden)
      end

      new_participant = Participant.create!(
        surname: current_account.username,
        account_id: current_account.id,
        retrospective: retrospective
      )
      cookies.signed[:participant_id] = using_participant = new_participant.id
    end
    # As participant_id cookie might have changed, we should reset current_participant which is memoized
    # Better refetching it so that we can apply some includes
    participant =
      retrospective
        .participants
        .includes(:retrospective, :reactions, reflections: [:topic, :owner, zone: :retrospective])
        .find(using_participant)

    participant.join unless retrospective.step == 'done'

    full_retrospective = Retrospective.includes(retrospective.relationships_to_load).find(params[:id])
    initial_state = full_retrospective.initial_state(participant).merge(profile: participant.full_profile)

    render json: { retrospective: full_retrospective.as_json, initialState: initial_state }
  end
end
