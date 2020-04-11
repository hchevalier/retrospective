class OrchestratorChannel < ApplicationCable::Channel
  def subscribed
    stream_for Retrospective.find(params[:retrospective_id])
    return unless current_user

    Rails.logger.debug "#{current_user.surname} (#{current_user.id}) subscribed"
    current_user.update!(logged_in: true)
    broadcast_to(current_user.retrospective, action: 'participantStatusChanged', parameters: { participant: current_user.profile })

    current_user.retrospective.reset_original_organizer! if current_user.original_organizer?
  end

  def unsubscribed
    return unless current_user

    Rails.logger.debug "#{current_user.surname} (#{current_user.id}) unsubscribed"
    current_user.update!(logged_in: false)

    sleep 5 # TODO: most ugly thing in the world, stack a job to execute in 5s to see if user is still logged out, if yes changer organizer
    current_user.reload

    if current_user.organizer? && !current_user.logged_in
      current_user.retrospective.change_organizer!
      current_user.reload
    end

    broadcast_to(current_user.retrospective, action: 'participantStatusChanged', parameters: { participant: current_user.profile })
  end

  def start_timer(data)
    timer_end_at = Time.now + data['duration'].to_i.seconds
    broadcast_to(current_user.retrospective, action: 'setTimer', parameters: { duration: data['duration'] })
    current_user.retrospective.update!(timer_end_at: timer_end_at)
  end

  def receive(data)
    return unless current_user&.organizer?

    retrospective = Retrospective.find(current_user.retrospective_id)
    case data.fetch('intent')
    when 'next'
      retrospective.next_step!
    end
  end
end
