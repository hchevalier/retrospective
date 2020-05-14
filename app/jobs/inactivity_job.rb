class InactivityJob < ApplicationJob
  queue_as :default

  def perform(participant)
    return if participant.logged_in

    if participant.organizer?
      participant.retrospective.change_organizer!
      participant.reload
      OrchestratorChannel.broadcast_to(
        participant.retrospective,
        action: 'updateOrganizerInfo',
        parameters: { organizerInfo: participant.retrospective.organizer_info }
      )
    end

    OrchestratorChannel.broadcast_to(
      participant.retrospective,
      action: 'refreshParticipant',
      parameters: { participant: participant.profile }
    )
  end
end
