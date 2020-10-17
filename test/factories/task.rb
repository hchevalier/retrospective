# frozen_string_literal: true

FactoryBot.define do
  factory :task do
    status { :todo }
    description { 'One small task' }
    author { reflection.retrospective.participants.first }
    assignee { author.account }
  end
end
