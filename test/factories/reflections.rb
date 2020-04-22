# frozen_string_literal: true

FactoryBot.define do
  factory :reflection do
    content { 'a reflection' }
    revealed { true }

    trait :glad do
      content { 'A glad reflection' }
      zone { Zone.find_by(identifier: 'Glad') }
    end

    trait :sad do
      content { 'A sad reflection' }
      zone { Zone.find_by(identifier: 'Sad') }
    end

    trait :mad do
      content { 'A mad reflection' }
      zone { Zone.find_by(identifier: 'Mad') }
    end
  end
end
