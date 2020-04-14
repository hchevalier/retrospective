require 'test_helper'

class Retrospective::ReactionsTest < ActionDispatch::IntegrationTest
  test 'can add the same reaction than someone else by clicking on it' do
    retrospective = create_retrospective!(step: 'grouping')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    add_reaction(reflection, :star_struck)

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(other_participant, with_flags: '(you)')
      within ".reflection[data-id='#{reflection.id}']" do
        assert_text Reaction::EMOJI_LIST[:star_struck]
        assert_css '.emoji-chip.star-struck.selected'
        refute_css '.emoji-chip.star-struck.selected.own'
        find('.emoji-chip.star-struck').click
        assert_css '.emoji-chip.star-struck.selected.own'
        within '.emoji-chip.star-struck' do
          assert_text '2'
        end
      end
    end

    within ".reflection[data-id='#{reflection.id}']" do
      within '.emoji-chip.star-struck' do
        assert_text '2'
      end
    end
  end

  test 'remove own reaction by clicking on it' do
    retrospective = create_retrospective!(step: 'grouping')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    add_reaction(reflection, :star_struck)

    within ".reflection[data-id='#{reflection.id}']" do
      assert_text Reaction::EMOJI_LIST[:star_struck]
      find('.emoji-chip.star-struck').click
      refute_text Reaction::EMOJI_LIST[:star_struck]
    end
  end

  test 'remove own reaction by choosing it again in the emoji modal' do
    retrospective = create_retrospective!(step: 'grouping')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    add_reaction(reflection, :star_struck)

    within ".reflection[data-id='#{reflection.id}']" do
      assert_text Reaction::EMOJI_LIST[:star_struck]
    end

    add_reaction(reflection, :star_struck)

    within ".reflection[data-id='#{reflection.id}']" do
      refute_text Reaction::EMOJI_LIST[:star_struck]
    end
  end

  private

  def add_reaction(reflection, reaction_name)
    find('#participants-list').hover
    within ".reflection[data-id='#{reflection.id}']" do
      find('.reflection-content-container').hover
      find('.reactions-bar .add-reaction').click
      within '.emoji-modal' do
        find(".emoji-chip.#{reaction_name.to_s.gsub('_', '-')}").click
      end
      refute_css '.emoji-modal'
      assert_text Reaction::EMOJI_LIST.fetch(reaction_name)
    end
  end
end
