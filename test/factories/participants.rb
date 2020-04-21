# frozen_string_literal: true

FactoryBot.define do
  factory :participant, aliases: %i[organizer revealer owner] do
    surname { 'Organizer' }
    email { "#{surname.downcase.tr(' ', '_')}@yopmail.com" }

    factory :other_participant do
      surname { 'Other participant' }
    end
  end
end
