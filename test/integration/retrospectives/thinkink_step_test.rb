# frozen_string_literal: true

require 'test_helper'

class Retrospective::ThinkingStepTest < ActionDispatch::IntegrationTest
  test 'can trigger the thinking step for other participants' do
    retrospective = create(:retrospective)
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
    assert_logged_as_facilitator
    refute_text 'My reflections'

    new_window = open_new_window
    within_window(new_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      refute_logged_as_facilitator
      refute_text 'My reflections'
    end

    next_step
    assert_text 'My reflections'

    within_window(new_window) do
      assert_text 'My reflections'
    end
  end

  test 'can write a reflection and assign it to a zone' do
    retrospective = create(:retrospective, step: 'thinking')

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_text 'My reflections'
    refute_reflection_in_zone('Glad')

    find('.reflection-content-container').click
    fill_in 'content', with: 'This is my reflection'
    find('textarea[name="content"]').send_keys(:tab)
    assert_selector '.background.highlight'
    find('.zone', text: 'Glad').click

    assert_reflection_in_zone('Glad')
  end

  test 'can use a shortcut to open a blank reflection' do
    retrospective = create(:retrospective, step: 'thinking')

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_text 'My reflections'

    page.document.evaluate_script("document.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))")
    assert_equal '', find('textarea[name="content"]').value
    find('textarea[name="content"]').send_keys("Used + to write my reflection\t")
    assert_selector '.background.highlight'
    find('.zone', text: 'Glad').click

    assert_text 'Used + to write my reflection'
  end

  test 'a participant cannot see reflections written by other participants' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(other_participant)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_text 'My reflections'
    refute_reflection_in_zone('Glad')
    within '#reflections-panel' do
      refute_text 'A glad reflection'
    end
  end

  test 'can list reflections from a zone in reflections pannel' do
    retrospective = create(:retrospective, step: 'thinking')
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    within '#reflections-panel' do
      assert_text 'A glad reflection'
    end
  end

  test 'can edit a reflection' do
    retrospective = create(:retrospective, step: 'thinking')
    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

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
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    within '#reflections-panel' do
      assert_text 'A glad reflection'
      find('.delete-icon').click
    end

    assert_text 'My reflections'
    refute_reflection_in_zone('Glad')
  end

  test 'can notice thinking statuses as facilitator' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
    assert_logged_in(retrospective.facilitator, with_flags: %i[self facilitator])

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(other_participant, with_flags: %i[self])

      refute_status_visibility(retrospective.facilitator)
      refute_status_visibility(other_participant)
    end

    logged_in_as(retrospective.facilitator)
    assert_thinking(retrospective.facilitator)
    assert_thinking(other_participant)

    within '#reflections-panel' do
      click_on "I'm done"
      assert_text 'I forgot something'
    end

    assert_done(retrospective.facilitator)
    assert_thinking(other_participant)

    within_window(other_participant_window) do
      logged_in_as(other_participant)
      refute_status_visibility(retrospective.facilitator)
      refute_status_visibility(other_participant)
      within '#reflections-panel' do
        click_on "I'm done"
        assert_text 'I forgot something'
      end
    end

    assert_done(retrospective.facilitator)
    assert_done(other_participant)

    within_window(other_participant_window) do
      logged_in_as(other_participant)
      refute_status_visibility(retrospective.facilitator)
      refute_status_visibility(other_participant)
      within '#reflections-panel' do
        click_on 'I forgot something'
        assert_text "I'm done"
      end
    end

    assert_done(retrospective.facilitator)
    assert_thinking(other_participant)

    logged_out
  end

  private

  def refute_status_visibility(participant)
    within ".avatar[data-id='#{participant.id}']" do
      refute_css '.light-bulb'
      refute_css '.check'
    end
  end

  def assert_thinking(participant)
    within ".avatar[data-id='#{participant.id}']" do
      assert_css '.light-bulb'
      refute_css '.check'
    end
  end

  def assert_done(participant)
    within ".avatar[data-id='#{participant.id}']" do
      refute_css '.light-bulb'
      assert_css '.check'
    end
  end
end
