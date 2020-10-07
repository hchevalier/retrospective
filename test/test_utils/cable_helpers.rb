module CableHelpers
  def cable_connection_for(participant)
    ActionCable.server.remote_connections.where(current_participant: participant, anonymous_uuid: nil)
  end
end
