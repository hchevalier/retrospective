# frozen_string_literal: true

class TaskReminderMailer < ApplicationMailer
  def send_reminder(account:)
    @account = account

    host = 'https://docto-retrospective.herokuapp.com'
    @link = single_page_app_url(path: '', host: host)

    mail(to: @account.email, subject: 'Pending tasks reminder')
  end
end
