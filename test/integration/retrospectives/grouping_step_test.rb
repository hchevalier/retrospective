# frozen_string_literal: true

require 'test_helper'

class Retrospective::GroupingStepTest < ActionDispatch::IntegrationTest
  test 'can trigger the grouping step for other participants' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    assert_retro_started
    assert_text 'New reflection'

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_retro_started
      assert_text 'New reflection'
    end

    click_on 'Next'
    assert_grouping_step_for_organizer
    refute_text 'New reflection'

    within_window(other_participant_window) do
      assert_grouping_step_for_participant
      refute_text 'New reflection'
    end
  end

  test 'can choose a participant to be the revealer' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    assert_logged_in(other_participant, with_flags: :none)

    find(".participant[data-id='#{other_participant.id}']").click
    assert_logged_in(other_participant, with_flags: '(reveal.)')
  end

  test 'revealer sees his reflections and looses the revealer token when closing the modal' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    create(:reflection, :glad, owner: other_participant, revealed: false)

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(other_participant, with_flags: '(you)')
      refute_text 'A glad reflection'
    end

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    find(".participant[data-id='#{other_participant.id}']").click
    refute_text 'A glad reflection'

    within_window(other_participant_window) do
      assert_logged_in(other_participant, with_flags: '(you, reveal.)')
      assert_css '#reflections-list-modal'
      assert_text 'A glad reflection'
      click_on 'Reveal'
      refute_css '#reflections-list-modal'
      assert_logged_in(other_participant, with_flags: '(you)')
    end

    assert_text 'A glad reflection'
  end

  test 'unread reflections out of viewport are noticed by a banner' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    create_list(:reflection, 4, :glad, owner: other_participant, revealed: false)
    create(:reflection, :mad, owner: other_participant, revealed: false)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    find(".participant[data-id='#{other_participant.id}']").click

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      assert_logged_in(other_participant, with_flags: '(you, reveal.)')
      assert_css '#reflections-list-modal'

      all('#reflections-list-modal button', text: 'Reveal').each.with_index do |reveal_button, index|
        next if index > 3
        reveal_button.click
      end
    end

    within find('.zone-column', match: :first) do
      assert_text '⬇︎ Unread reflection ⬇︎'
      assert_css '.reflection[data-read=true]', count: 3
      scroll_to(all('.reflection')[3])
      refute_text '⬇︎ Unread reflection ⬇︎'
      assert_css '.reflection[data-read=true]', count: 4
    end

    within_window(other_participant_window) do
      all('#reflections-list-modal button', text: 'Reveal').last.click
    end

    within all('.zone-column').last do
      assert_text '⬆︎ Unread reflection ⬆︎'
      scroll_to(all('.reflection').last)
      refute_text '⬆︎ Unread reflection ⬆︎'
      assert_css '.reflection[data-read=true]', count: 1
    end
  end

  test 'clicking on notice banner scrolls to last unread reflection from column' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    create_list(:reflection, 12, :glad, owner: other_participant, revealed: false)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    find(".participant[data-id='#{other_participant.id}']").click

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      assert_logged_in(other_participant, with_flags: '(you, reveal.)')
      assert_css '#reflections-list-modal'

      all('#reflections-list-modal button', text: 'Reveal').each(&:click)
    end

    within find('.zone-column', match: :first) do
      find('.unread-notice.below').click
      refute_text '⬇︎ Unread reflection ⬇︎'
      assert_text '⬆︎ Unread reflection ⬆︎'
      find('.unread-notice.above').click
      refute_text '⬆︎ Unread reflection ⬆︎'
      assert_text '⬇︎ Unread reflection ⬇︎'
    end
  end

  test 'can add reactions to a revealed reflection' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection = create(:reflection, :glad, owner: retrospective.organizer)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_organizer
    assert_text 'A glad reflection'
    refute_text Reaction::EMOJI_LIST[:star_struck]

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(other_participant, with_flags: '(you)')
      assert_grouping_step_for_participant
      within ".reflection[data-id='#{reflection.id}']" do
        refute_text Reaction::EMOJI_LIST[:star_struck]
      end
    end

    find('#participants-list').hover
    within ".reflection[data-id='#{reflection.id}']" do
      find('.reflection-content-container').hover
      find('.reactions-bar .add-reaction').click
      assert_css '.emoji-modal'
      find('.emoji-chip.star-struck').click
      refute_css '.emoji-modal'
      assert_text Reaction::EMOJI_LIST[:star_struck]
    end

    within_window(other_participant_window) do
      within ".reflection[data-id='#{reflection.id}']" do
        assert_text Reaction::EMOJI_LIST[:star_struck]
      end
    end
  end

  test 'can group two reflections together if they belong to the same column' do
    retrospective = create(:retrospective, step: 'grouping')
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    reflection_b = create(:reflection, :glad, owner: retrospective.organizer)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_organizer

    assert_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_a))
    end

    assert_topic_contains(Topic.last, reflection_a, reflection_b)
  end

   test 'group label is the first word of the first reflection' do
    retrospective = create(:retrospective, step: 'grouping')
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer, content: 'First reflection')
    reflection_b = create(:reflection, :glad, owner: retrospective.organizer, content: 'Second reflection')

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_organizer

    assert_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_a))
    end

    within topic_container(Topic.last) do
      within '.topic-label' do
        assert_text 'First'
        refute_text 'second'
        refute_text 'reflection'
      end
    end
  end

  test 'group can be changed for a reflection' do
    retrospective = create(:retrospective, step: 'grouping')
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer, content: 'First reflection')
    reflection_b = create(:reflection, :glad, owner: retrospective.organizer, content: 'Second reflection')
    reflection_c = create(:reflection, :glad, owner: retrospective.organizer, content: 'Third reflection')

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_organizer

    assert_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_a))
    end

    initial_topic = Topic.last
    assert_no_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_c))
    end

    new_topic = Topic.last
    within topic_container(new_topic) do
      within '.topic-label' do
        assert_text 'Second'
      end
    end

    refute_css ".topic[data-id='#{initial_topic.id}']"
  end

  def sticky_note(reflection)
    find(".reflection[data-id='#{reflection.id}']")
  end

  def topic_container(topic)
    find(".topic[data-id='#{topic.id}']").ancestor('.topic-container')
  end

  def assert_topic_contains(topic, *reflections)
    within ".topic[data-id='#{topic.id}']" do
      reflections.each { |reflection| assert_css ".reflection[data-id='#{reflection.id}']" }
    end
  end

  def assert_grouping_step_for_organizer
    assert_text 'Click on a participant so that he can reveal his reflections'
  end

  def assert_grouping_step_for_participant
    assert_text 'The organizer now chooses a participant so that he can reveal his reflections'
  end
end
