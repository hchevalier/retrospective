# frozen_string_literal: true

FactoryBot.define do
  factory :pending_invitation do
    sequence(:email) { |n| "someone+#{n}@hostname.tld" }
    association :account, strategy: :build
  end
end
