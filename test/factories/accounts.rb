# frozen_string_literal: true

FactoryBot.define do
  factory :account do
    username { 'account' }
    sequence(:email) { |n| "account#{n}@yopmail.com" }
    password { SecureRandom.hex(10) }
    password_confirmation { password }
  end
end
