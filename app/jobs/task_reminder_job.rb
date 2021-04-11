# frozen_string_literal: true

class TaskReminderJob < ApplicationJob
  queue_as :default

  def perform(retrospective:)
    participants = retrospective.participants
    participants.each do |participant|
      account = participant.account
      task_to_do = account.assigned_tasks.todo
      next if task_to_do.none?

      TaskReminderMailer.send_reminder(account: account).deliver_later
    end
  end
end
