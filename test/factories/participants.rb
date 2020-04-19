# frozen_string_literal: true

FactoryBot.define do
  factory :participant, aliases: %i[organizer revealer] do
    surname { 'Organizer' }
    email { "#{surname.downcase}@yopmail.com" }
  end
end
