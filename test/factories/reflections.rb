# frozen_string_literal: true

FactoryBot.define do
  factory :reflection do
    content { 'a reflection' }
    revealed { true }

    trait :long do
      content do
        <<~LOREM
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nibh turpis, luctus eget semper faucibus,
          lobortis dignissim leo. Cras ultricies lacinia lacinia. Etiam nec tortor in mi auctor posuere eu a metus.
          Cras nec orci congue tortor aliquet elementum eu a erat. Vivamus pellentesque nunc in euismod vehicula.
          Quisque tristique sed nisi vel interdum. Nulla eu ligula est. Praesent sit amet sodales massa.
          Sed non sapien viverra, iaculis ante vel, pellentesque neque. Nullam a tellus eu erat fermentum bibendum vitae
          nec arcu. Cras ultrices bibendum lectus, id porttitor tellus sagittis in. Quisque viverra velit euismod
          ultricies interdum.'
        LOREM
      end
    end

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
