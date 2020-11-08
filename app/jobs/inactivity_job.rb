# frozen_string_literal: true

class InactivityJob < ApplicationJob
  queue_as :default

  def perform(participant)
    return if participant.logged_in

    if participant.facilitator?
      participant.retrospective.change_facilitator!
      participant.reload
    end

    participant.retrospective.broadcast_order('refreshParticipant', { participant: participant.profile })
  end
end
