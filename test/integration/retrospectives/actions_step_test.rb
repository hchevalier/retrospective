# frozen_string_literal: true

require 'test_helper'

class Retrospective::ActionsStepTest < ActionDispatch::IntegrationTest
  test 'ensure votes are closed' do
    retrospective = create(:retrospective, step: 'actions')
    reflection = create(:reflection, :glad, owner: retrospective.organizer)
    retrospective.update!(discussed_reflection: reflection)
    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      refute_css '.vote'
      refute_css '.unvote'
    end
  end

  test 'initial discussed reflection is the one with most votes' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    reflection_b = create(:reflection, :sad, owner: other_participant)
    create_list(:vote, 3, target: reflection_a, author: retrospective.organizer)
    create_list(:vote, 2, target: reflection_b, author: other_participant)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    click_on 'Next'
    within '.reflection' do
      assert_text 'A glad reflection'
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      within '.reflection' do
        assert_text 'A glad reflection'
      end
    end
  end

  test 'organizer can change the discussed reflection' do
    retrospective = create(:retrospective, step: 'actions')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    create(:reflection, :sad, owner: other_participant)
    create(:vote, target: reflection_a, author: retrospective.organizer)
    retrospective.update!(discussed_reflection: reflection_a)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    within '.reflection' do
      assert_text 'A glad reflection'
    end

    all('#reflections-list .sticky-bookmark').last.click

    within '.reflection' do
      assert_text 'A sad reflection'
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      within '.reflection' do
        assert_text 'A sad reflection'
      end

      all('#reflections-list .sticky-bookmark').first.click

      within '.reflection' do
        assert_text 'A sad reflection'
      end
    end
  end

  test 'can create a task' do
    retrospective = create_retrospective!(step: 'actions')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    retrospective.update!(discussed_reflection: reflection_a)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    fill_in 'content', with: 'my task'
    material_ui_select @organizer.id, from: 'assignee'
    click_on 'Take action'

    within '#tasks-list' do
      assert_text 'Assigned to Organizer'
      assert_text 'my task'
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      within '#tasks-list' do
        assert_text 'Assigned to Organizer'
        assert_text 'my task'
      end
    end
  end

  test 'can create a task even when the discussed reflection changed' do
    retrospective = create_retrospective!(step: 'actions')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: @organizer, revealed: true)
    retrospective.update!(discussed_reflection: reflection_a)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    fill_in 'content', with: 'my task'
    material_ui_select @organizer.id, from: 'assignee'

    all('#reflections-list .sticky-bookmark').last.click

    within '#action-editor' do
      assert_text 'You are writing an action for a reflection that is not the one currently displayed'
      assert_text '(A glad reflection)'
    end

    click_on 'Take action'

    within '#tasks-list', visible: false do
      refute_text 'Assigned to Organizer'
      refute_text 'my task'
    end

    all('#reflections-list .sticky-bookmark').first.click

    within '#tasks-list' do
      assert_text 'Assigned to Organizer'
      assert_text 'my task'
    end
  end

  test 'can start to write a task and change to the currently discussed reflection' do
    retrospective = create_retrospective!(step: 'actions')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: @organizer, revealed: true)
    retrospective.update!(discussed_reflection: reflection_a)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    fill_in 'content', with: 'my task'
    material_ui_select @organizer.id, from: 'assignee'

    all('#reflections-list .sticky-bookmark').last.click

    within '#action-editor' do
      assert_text 'You are writing an action for a reflection that is not the one currently displayed'
      assert_text '(A glad reflection)'
      click_on 'Change to currently displayed reflection'
    end

    within '#action-editor', visible: false do
      refute_text 'You are writing an action for a reflection that is not the one currently displayed'
    end

    click_on 'Take action'

    within '#tasks-list' do
      assert_text 'Assigned to Organizer'
      assert_text 'my task'
    end
  end

  test 'can update a task' do
    retrospective = create_retrospective!(step: 'actions')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    retrospective.update!(discussed_reflection: reflection)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    fill_in 'content', with: 'my task'
    material_ui_select @organizer.id, from: 'assignee'
    click_on 'Take action'

    within '#tasks-list' do
      assert_text 'Assigned to Organizer'
      assert_text 'my task'
      find('.edit-icon').click
    end

    within '#action-editor' do
      assert_text 'You are editing an action for the following reflection:'
      assert_text 'A glad reflection'
      fill_in 'content', with: 'my updated task'
    end
    material_ui_select other_participant.id, from: 'assignee'
    within '#action-editor' do
      click_on 'Update'
    end

    within '#tasks-list' do
      assert_text 'Assigned to Other one'
      assert_text 'my updated task'
    end
  end
end
