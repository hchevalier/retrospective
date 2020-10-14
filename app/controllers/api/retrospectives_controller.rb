class Api::RetrospectivesController < ApplicationController
  def index
    group_ids = current_account.accessible_groups.ids
    retrospectives = current_account.retrospectives.includes(:group).where(group_id: group_ids)
    render json: retrospectives.map(&:as_short_json).sort_by { | retrospective | retrospective[:createdAt] }.reverse
  end

  def show
    retrospective =
      current_participant&.retrospective_id == params[:id] ?
      current_participant.retrospective :
      Retrospective.includes(:participants, :zones).find(params[:id])

    exisiting_participant = retrospective.participants.find { |participant| participant.account == current_account }

    if exisiting_participant && current_participant&.id != exisiting_participant.id
      # Change participant for current account to this retrospective's one
      cookies.signed[:participant_id] = exisiting_participant.id
    elsif !exisiting_participant
      # User don't have a participant for this retrospective yet
      if retrospective.step == 'done' || !current_account.accessible_groups.find_by(id: retrospective.group_id)
        # retrospective is already done or no active access to the group
        return render(json: { status: :forbidden}, status: :forbidden)
      end

      new_participant = Participant.create!(
        surname: current_account.username,
        account_id: current_account.id,
        retrospective: retrospective
      )
      cookies.signed[:participant_id] = new_participant.id
    end
    reload_current_participant

    current_participant.join
    initial_state = retrospective.initial_state(current_participant).merge(profile: current_participant.full_profile)

    render json: { retrospective: retrospective.as_json, initialState: initial_state }
  end
end
