# frozen_string_literal: true

FactoryBot.define do
  factory :participant, aliases: %i[facilitator revealer owner] do
    surname { 'Facilitator' }
    association :account, strategy: :build

    factory :other_participant do
      surname { 'Other participant' }
    end

    after(:create) do |participant, _evaluator|
      participant.retrospective.group.add_member(participant.account)
    end
  end
end
