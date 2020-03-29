class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    puts "#{current_user.surname} (#{current_user.id}) subscribed"
    stream_for Retrospective.find(params[:retrospective_id])
  end

  def unsubscribed
    puts "#{current_user.surname} (#{current_user.id}) unsubscribed"
  end

  def receive(data)
    return unless data.fetch('body').in?(['Hello', 'Bonjour'])

    retrospective = Retrospective.find(current_user.retrospective_id)
    puts "Broadcasting message from #{current_user.surname} (#{current_user.id})"
    AppearanceChannel.broadcast_to(retrospective, body: "#{current_user.surname} says #{data['body']}")
  end
end
