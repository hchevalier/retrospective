# frozen_string_literal: true

FactoryBot.define do
  factory :reaction do
    factory :vote do
      kind { 'vote' }
    end
  end
end
