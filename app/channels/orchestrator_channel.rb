class OrchestratorChannel < ApplicationCable::Channel
  def subscribed
    puts "#{current_user.surname} (#{current_user.id}) subscribed"
    stream_for Retrospective.find(params[:retrospective_id])
  end

  def unsubscribed
    puts "#{current_user.surname} (#{current_user.id}) unsubscribed"
  end

  def receive(data)
    return unless current_user.organizer?

    retrospective = Retrospective.find(current_user.retrospective_id)
    case data.fetch('intent')
    when 'next'
      retrospective.broadcast_order(:next)
    end
  end
end
