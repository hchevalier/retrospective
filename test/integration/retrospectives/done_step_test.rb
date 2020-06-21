# frozen_string_literal: true

require 'test_helper'

class Retrospective::DoneStepTest < ActionDispatch::IntegrationTest
  test 'ensure screen is read-only are closed' do
    retrospective = create(:retrospective, step: 'done')
    organizer = retrospective.organizer
    reflection = create(:reflection, :glad, owner: retrospective.organizer)
    retrospective.update!(discussed_reflection: reflection)
    reflection.reactions.create!(kind: :emoji, content: :star_struck, author: organizer, retrospective: retrospective)
    reflection.tasks.create!(author: organizer, assignee: organizer, description: 'my task')

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_text 'Lobby'
    refute_text 'Next'

    within ".reflection[data-id='#{reflection.id}']" do
      refute_css '.reactions-bar'

      within '.vote-corner' do
        refute_css '.vote'
        refute_css '.unvote'
      end
    end

    within '#tasks-list' do
      refute_css '.edit-icon'
      refute_css '.delete-icon'
    end
  end
end
