class ApplicationController < ActionController::Base
  def current_user
    @current_user ||= begin
      (user_id = cookies.signed[:user_id]) ? Participant.find(user_id) : nil
    end
  end
end
