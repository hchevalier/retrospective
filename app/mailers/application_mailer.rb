# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('SMTP_USERNAME', 'noreply@docto-retrospective.herokuapp.com')
  layout 'mailer'
end
