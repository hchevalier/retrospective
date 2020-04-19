# frozen_string_literal: true

FactoryBot.define do
  factory :retrospective do
    name { 'Retrospective' }
    kind { 'glad_sad_mad' }
    organizer

    trait :with_reflection do
      
    end
  end
end
