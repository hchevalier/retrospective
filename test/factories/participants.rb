# frozen_string_literal: true

FactoryBot.define do
  factory :participant, aliases: %i[organizer revealer owner] do
    surname { 'Organizer' }
    association :account, strategy: :build

    factory :other_participant do
      surname { 'Other participant' }
    end

    factory :other_participant2 do
      surname { 'Other participant2' }
    end
  end
end
