class Api::RetrospectivesController < ApplicationController
  def index
    group_ids = current_account.accessible_groups.ids
    retrospectives = (
      current_account.retrospectives.includes(:group).where(group_id: group_ids) +
      Retrospective.where(group_id: group_ids).where('created_at > ?', 90.minutes.ago)
    ).uniq

    render json: retrospectives.map(&:as_short_json).sort_by { | retrospective | retrospective[:createdAt] }.reverse
  end

  def show
    bare_retrospective = Retrospective.includes(:participants).select(:id, :step, :group_id).find(params[:id])
    exisiting_participant = bare_retrospective.participants.find { |participant| participant.account == current_account }

    if exisiting_participant && current_participant&.id != exisiting_participant.id
      # Change participant for current account to this retrospective's one
      cookies.signed[:participant_id] = exisiting_participant.id
    elsif !exisiting_participant
      # User don't have a participant for this retrospective yet
      if bare_retrospective.step == 'done' || !current_account.accessible_groups.find_by(id: bare_retrospective.group_id)
        # retrospective is already done or no active access to the group
        return render(json: { status: :forbidden}, status: :forbidden)
      end

      new_participant = Participant.create!(
        surname: current_account.username,
        account_id: current_account.id,
        retrospective: bare_retrospective
      )
      cookies.signed[:participant_id] = new_participant.id
    end
    # As participant_id cookie might have changed, we should reset current_participant which is memoized
    # Better refetching it so that we can apply some includes
    participant = Participant.eager_load(:retrospective, :reactions, reflections: [:zone, :topic, :owner]).find(cookies.signed[:participant_id])
    participant.join unless bare_retrospective.step == 'done'

    retrospective = Retrospective.includes(bare_retrospective.relationships_to_load).find(params[:id])
    initial_state = retrospective.initial_state(participant).merge(profile: participant.full_profile)

    render json: { retrospective: retrospective.as_json, initialState: initial_state }
  end
end
