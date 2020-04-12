class OrchestratorChannel < ApplicationCable::Channel
  def subscribed
    stream_for Retrospective.find(params[:retrospective_id])
    return unless current_user
    current_user.reload

    Rails.logger.debug "#{current_user.surname} (#{current_user.id}) subscribed"
    current_user.update!(logged_in: true)
    broadcast_to(current_user.retrospective, action: 'refreshParticipant', parameters: { participant: current_user.profile })

    current_user.retrospective.reset_original_organizer! if current_user.original_organizer?
  end

  def unsubscribed
    return unless current_user
    current_user.reload

    Rails.logger.debug "#{current_user.surname} (#{current_user.id}) unsubscribed"
    current_user.update!(logged_in: false)

    sleep 5 # TODO: most ugly thing in the world, stack a job to execute in 5s to see if user is still logged out, if yes changer organizer
    current_user.reload

    if current_user.organizer? && !current_user.logged_in
      current_user.retrospective.change_organizer!
      current_user.reload
    end

    broadcast_to(current_user.retrospective, action: 'refreshParticipant', parameters: { participant: current_user.profile })
  end

  def start_timer(data)
    return unless current_user.reload.organizer?

    timer_end_at = Time.now + data['duration'].to_i.seconds
    broadcast_to(current_user.retrospective, action: 'setTimer', parameters: { duration: data['duration'] })
    current_user.retrospective.update!(timer_end_at: timer_end_at)
  end

  def set_revealer(data)
    return unless current_user.reload.organizer?

    retrospective = current_user.retrospective
    current_revealer = retrospective.revealer
    new_revealer = retrospective.participants.find(data['uuid'])
    retrospective.update!(revealer: new_revealer)
    broadcast_to(current_user.retrospective, action: 'refreshParticipant', parameters: { participant: current_revealer.reload.profile }) if current_revealer
    broadcast_to(current_user.retrospective, action: 'refreshParticipant', parameters: { participant: new_revealer.reload.profile })
  end

  def reveal_reflection(data)
    return unless current_user.reload.revealer?

    retrospective = current_user.retrospective
    reflection = retrospective.reflections.find(data['uuid'])
    reflection.update!(revealed: true)
    broadcast_to(retrospective, action: 'revealReflection', parameters: { reflection: reflection.readable })
  end

  def drop_revealer_token
    return unless current_user.reload.revealer?

    retrospective = current_user.retrospective
    retrospective.update!(revealer: nil)
    broadcast_to(retrospective, action: 'refreshParticipant', parameters: { participant: current_user.reload.profile })
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
