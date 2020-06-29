# frozen_string_literal: true

FactoryBot.define do
  factory :group do
    sequence(:name) { |n| "Group #{n}" }

    trait :deleted do
      deleted_at { 1.day.ago }
    end
  end
end
