module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_participant
    end

    private

    def find_participant
      Participant.find_by(id: cookies.signed[:user_id]) || reject_unauthorized_connection
    end
  end
end
