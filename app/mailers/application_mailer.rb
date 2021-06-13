# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: Rails.configuration.authentication[:smtp_username]
  layout 'mailer'
end
