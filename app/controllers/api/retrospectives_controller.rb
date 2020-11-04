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

  # rubocop:todo Metrics/AbcSize
  def show
    retrospective = Retrospective.includes(:participants).find(params[:id])
    exisiting_participant = retrospective.participant_for_account(current_account)
    logged_participant_id = current_participant&.id

    if exisiting_participant && logged_participant_id != exisiting_participant.id
      # Change participant for current account to this retrospective's one
      cookies.signed[:participant_id] = logged_participant_id = exisiting_participant.id
    elsif !exisiting_participant
      # User don't have a participant for this retrospective yet
      if retrospective.step == 'done' || !current_account.accessible_groups.find_by(id: retrospective.group_id)
        # retrospective is already done or no active access to the group
        cookies.signed[:participant_id] = nil if logged_participant_id
        return render(json: { status: :forbidden }, status: :forbidden)
      end

      new_participant = retrospective.add_participant_for_account(current_account)
      cookies.signed[:participant_id] = logged_participant_id = new_participant.id
    end
    # As participant_id cookie might have changed, we should reset current_participant which is memoized
    # Better refetching it so that we can apply some includes
    participant = retrospective.find_participant_with_relationships(logged_participant_id)
    participant.join unless retrospective.step == 'done'

    full_retrospective = Retrospective.includes(retrospective.relationships_to_load).find(params[:id])
    initial_state = full_retrospective.initial_state(participant).merge(profile: participant.full_profile)

    render json: { retrospective: full_retrospective.as_json, initialState: initial_state }
  end
  # rubocop:enable Metrics/AbcSize
end
