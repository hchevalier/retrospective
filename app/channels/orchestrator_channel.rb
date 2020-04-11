class OrchestratorChannel < ApplicationCable::Channel
  def subscribed
    Rails.logger.debug "#{current_user.surname} (#{current_user.id}) subscribed"
    stream_for Retrospective.find(params[:retrospective_id])
  end

  def unsubscribed
    Rails.logger.debug "#{current_user.surname} (#{current_user.id}) unsubscribed"
  end

  def start_timer(data)
    timer_end_at = Time.now + data['duration'].to_i.seconds
    broadcast_to(current_user.retrospective, action: 'setTimer', parameters: { duration: data['duration'] })
    current_user.retrospective.update!(timer_end_at: timer_end_at)
  end

  def receive(data)
    return unless current_user.organizer?

    retrospective = Retrospective.find(current_user.retrospective_id)
    case data.fetch('intent')
    when 'next'
      retrospective.next_step!
    end
  end
end
