# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: Figaro.smtp_username || 'noreply@docto-retrospective.herokuapp.com'
  layout 'mailer'
end
