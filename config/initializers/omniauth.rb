# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'],
  skip_jwt: true,
  scope: 'userinfo.email,userinfo.profile',
  prompt: 'consent',
  origin_param: 'return_to'
end
