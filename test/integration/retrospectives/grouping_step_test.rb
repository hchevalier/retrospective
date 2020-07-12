# frozen_string_literal: true

require 'test_helper'

class Retrospective::GroupingStepTest < ActionDispatch::IntegrationTest
  test 'can trigger the grouping step for other participants' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_logged_as_facilitator
    assert_retro_started
    assert_text 'Click here to add a reflection'

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_retro_started
      assert_text 'Click here to add a reflection'
    end

    click_on 'Next'
    assert_grouping_step_for_facilitator
    refute_text 'Click here to add a reflection'

    within_window(other_participant_window) do
      assert_grouping_step_for_participant
      refute_text 'Click here to add a reflection'
    end
  end

  test 'can choose a participant to be the revealer' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_logged_as_facilitator
    assert_logged_in(other_participant, with_flags: [])

    find(".avatar[data-id='#{other_participant.id}']").click
    assert_logged_in(other_participant, with_flags: %i(revealer))
  end

  test 'can randomly pick a participant to be the revealer among those who did not reveal any reflection yet' do
    retrospective = create(:retrospective, step: 'grouping')
    participant = create(:other_participant, retrospective: retrospective)
    other_participant = create(:other_participant, retrospective: retrospective, surname: 'Other participant')

    create(:reflection, :glad, owner: retrospective.facilitator, revealed: false)
    create(:reflection, :glad, owner: participant, revealed: false)
    create(:reflection, :glad, owner: other_participant, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    assert_css('#assign-random-revealer')

    3.times do
      assert_no_one_has_the_revealer_token
      find('#assign-random-revealer').click
      revealer = current_revealer(retrospective.facilitator, participant, other_participant)
      close_modal_on_current_revealer_window(retrospective, revealer)
    end

    refute_css('#assign-random-revealer')
  end

  test 'revealer sees his reflections and looses the revealer token when closing the modal' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    create(:reflection, :glad, owner: other_participant, revealed: false)

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(other_participant, with_flags: %i(self))
      within '#zones-container' do
        refute_text 'A glad reflection'
      end
    end

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_logged_as_facilitator
    find(".avatar[data-id='#{other_participant.id}']").click
    refute_text 'A glad reflection'

    within_window(other_participant_window) do
      assert_logged_in(other_participant, with_flags: %i(self revealer))
      assert_text 'My reflections'
      assert_text 'A glad reflection'
      find('.eye-icon').click
      refute_text 'My reflections'
      assert_logged_in(other_participant, with_flags: %i(self))
    end

    within '#zones-container' do
      assert_text 'A glad reflection'
    end
  end

  test 'unread reflections out of viewport are noticed by a banner' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflections = create_list(:reflection, 2, :glad, :long, owner: other_participant, revealed: false)
    create(:reflection, :mad, owner: other_participant, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    find(".avatar[data-id='#{other_participant.id}']").click

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      assert_logged_in(other_participant, with_flags: %i(self revealer))
      assert_text 'My reflections'

      reflections.each do |reflection|
        find("#reflections-pannel .reflection[data-id='#{reflection.id}'] .eye-icon", visible: false).click
        refute_selector("#reflections-pannel .reflection[data-id='#{reflection.id}']")
      end
    end

    within find('.zone-column', match: :first) do
      assert_text '⬇︎ Unread reflection ⬇︎'
      assert_css '.reflection[data-read=true]', count: 1
      scroll_to(all('.reflection').last)
      refute_text '⬇︎ Unread reflection ⬇︎'
      assert_css '.reflection[data-read=true]', count: 2
    end

    within_window(other_participant_window) do
      all('#reflections-pannel .eye-icon').last.click
    end

    within all('.zone-column').last do
      assert_text '⬆︎ Unread reflection ⬆︎'
      scroll_to(find('.reflection'))
      refute_text '⬆︎ Unread reflection ⬆︎'
      assert_css '.reflection[data-read=true]', count: 1
    end
  end

  test 'clicking on notice banner scrolls to last unread reflection from column' do
    retrospective = create(:retrospective, step: 'grouping')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflections = create_list(:reflection, 3, :glad, :long, owner: other_participant, revealed: false)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    find(".avatar[data-id='#{other_participant.id}']").click

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      assert_logged_in(other_participant, with_flags: %i(self revealer))
      assert_text 'My reflections'

      reflections.each do |reflection|
        find("#reflections-pannel .reflection[data-id='#{reflection.id}'] .eye-icon", visible: false).click
        refute_selector("#reflections-pannel .reflection[data-id='#{reflection.id}']")
      end
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
    reflection = create(:reflection, :glad, owner: retrospective.facilitator)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_facilitator
    assert_text 'A glad reflection'
    refute_text Reaction::EMOJI_LIST[:star_struck]

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(other_participant, with_flags: %i(self))
      assert_grouping_step_for_participant
      within ".reflection[data-id='#{reflection.id}']" do
        refute_text Reaction::EMOJI_LIST[:star_struck]
      end
    end

    find('#participants-list').hover
    within ".reflection[data-id='#{reflection.id}']" do
      find('.reflection-content-container').hover
      assert_selector '.add-reaction'
      find('.add-reaction').click
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
    reflection_a = create(:reflection, :glad, owner: retrospective.facilitator)
    reflection_b = create(:reflection, :glad, owner: retrospective.facilitator)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_facilitator

    assert_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_a))
    end

    assert_topic_contains(Topic.last, reflection_a, reflection_b)
  end

   test 'group label is the first word of the first reflection' do
    retrospective = create(:retrospective, step: 'grouping')
    reflection_a = create(:reflection, :glad, owner: retrospective.facilitator, content: 'First reflection')
    reflection_b = create(:reflection, :glad, owner: retrospective.facilitator, content: 'Second reflection')

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_facilitator

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
    reflection_a = create(:reflection, :glad, owner: retrospective.facilitator, content: 'First reflection')
    reflection_b = create(:reflection, :glad, owner: retrospective.facilitator, content: 'Second reflection')
    reflection_c = create(:reflection, :glad, owner: retrospective.facilitator, content: 'Third reflection')

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_facilitator

    assert_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_a))
    end

    initial_topic = Topic.order(:created_at).last
    assert_no_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_c))
    end

    new_topic = Topic.order(:created_at).last
    within topic_container(new_topic) do
      within '.topic-label' do
        assert_text 'Second'
      end
    end

    assert_topic_contains(new_topic, reflection_b, reflection_c)

    refute_css ".topic[data-id='#{initial_topic.id}']"
  end

  test 'cannot group reflections from different columns' do
    retrospective = create(:retrospective, step: 'grouping')
    reflection_a = create(:reflection, :glad, owner: retrospective.facilitator, content: 'First reflection')
    reflection_b = create(:reflection, :sad, owner: retrospective.facilitator, content: 'Second reflection')

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_grouping_step_for_facilitator

    assert_no_difference 'Topic.count' do
      sticky_note(reflection_b).drag_to(sticky_note(reflection_a))
    end
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

  def assert_grouping_step_for_facilitator
    assert_text 'Click on a participant so that he can reveal his reflections'
  end

  def assert_grouping_step_for_participant
    assert_text 'The facilitator now chooses a participant so that he can reveal his reflections'
  end

  private

  def current_revealer(facilitator, participant, other_participant)
    revealer_id = find('.revealer').find(:xpath, '..')['data-id']
    case revealer_id
    when facilitator.id
      facilitator
    when participant.id
      participant
    when other_participant.id
      other_participant
    end
  end

  def close_modal_on_current_revealer_window(retrospective, revealer)
    within_window(open_new_window) do
      logged_in_as(revealer)
      visit retrospective_path(retrospective)
      find('.eye-icon').click
    end
  end

  def assert_no_one_has_the_revealer_token
    refute_selector('.avatar .revealer')
  end
end
