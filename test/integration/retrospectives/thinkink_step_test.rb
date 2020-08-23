# frozen_string_literal: true

require 'test_helper'

class Retrospective::ThinkingStepTest < ActionDispatch::IntegrationTest
  test 'can trigger the thinking step for other participants' do
    retrospective = create(:retrospective)
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_logged_as_facilitator
    refute_retro_started

    new_window = open_new_window
    within_window(new_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      refute_logged_as_facilitator
      refute_retro_started
    end

    click_on 'Next'
    assert_retro_started

    within_window(new_window) do
      assert_retro_started
    end
  end

  test 'can write a reflection and assign it to a zone' do
    retrospective = create(:retrospective, step: 'thinking')

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    assert_retro_started
    refute_reflection_in_zone('Glad')

    find('.create-icon').click
    fill_in 'content', with: 'This is my reflection'
    find('textarea[name="content"]').send_keys(:tab)
    assert_selector '.background.highlight'
    find('.zone', text: 'Glad').click

    assert_reflection_in_zone('Glad')
  end

  test 'a participant cannot see reflections written by other participants' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)

    assert_retro_started
    refute_reflection_in_zone('Glad')
    within '#reflections-panel' do
      refute_text 'A glad reflection'
    end
  end

  test 'can list reflections from a zone in reflections pannel' do
    retrospective = create(:retrospective, step: 'thinking')
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    within '#reflections-panel' do
      assert_text 'A glad reflection'
    end
  end

  test 'can edit a reflection' do
    retrospective = create(:retrospective, step: 'thinking')
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    within '#reflections-panel' do
      assert_text 'A glad reflection'
      find('.edit-icon').click
    end

    assert_field 'content', with: 'A glad reflection'
    fill_in 'content', with: 'I am still glad!'
    find('textarea[name="content"]').send_keys(:tab)

    refute_field 'content'
    assert_text 'I am still glad!'
  end

  test 'can delete a reflection' do
    retrospective = create(:retrospective, step: 'thinking')
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    within '#reflections-panel' do
      assert_text 'A glad reflection'
      find('.delete-icon').click
    end

    assert_retro_started
    refute_reflection_in_zone('Glad')
  end
end
