# frozen_string_literal: true

FactoryBot.define do
  factory :participant, aliases: %i[organizer revealer owner] do
    surname { 'Organizer' }
    association :account, strategy: :build

    factory :other_participant do
      surname { 'Other participant' }
    end

    after(:create) do |participant, _evaluator|
      group = participant.retrospective.group
      account = participant.account
      group.accounts << account unless group.accessible_by?(account)
    end
  end
end
