# frozen_string_literal: true

FactoryBot.define do
  factory :retrospective do
    name { 'Retrospective' }
    kind { 'glad_sad_mad' }
    association :organizer, strategy: :build

    transient do
      participants_attributes { [] }
    end

    after(:create) do |retrospective, evaluator|
      evaluator.participants_attributes.each do |participant|
        create(:participant, participant.merge(retrospective: retrospective))
      end
    end
  end
end
