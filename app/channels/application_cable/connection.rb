module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user, :anonymous_uuid

    def connect
      if cookies.signed[:user_id]
        self.current_user = find_participant
      else
        self.anonymous_uuid = SecureRandom.urlsafe_base64
      end
    end

    private

    def find_participant
      Participant.find_by(id: cookies.signed[:user_id]) || reject_unauthorized_connection
    end
  end
end
