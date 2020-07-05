# frozen_string_literal: true

FactoryBot.define do
  factory :retrospective do
    kind { 'glad_sad_mad' }
    association :organizer, strategy: :build
    association :group, strategy: :build

    transient do
      participants_attributes { [] }
    end

    after(:create) do |retrospective, evaluator|
      evaluator.participants_attributes.each do |participant|
        create(:participant, participant.merge(retrospective: retrospective))
      end

      retrospective.group.add_member(retrospective.organizer.account)
    end
  end
end
