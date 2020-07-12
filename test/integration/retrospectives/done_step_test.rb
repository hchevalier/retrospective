# frozen_string_literal: true

require 'test_helper'

class Retrospective::DoneStepTest < ActionDispatch::IntegrationTest
  test 'ensure screen is read-only are closed' do
    retrospective = create(:retrospective, step: 'done')
    facilitator = retrospective.facilitator
    reflection = create(:reflection, :glad, owner: retrospective.facilitator)
    retrospective.update!(discussed_reflection: reflection)
    reflection.reactions.create!(kind: :emoji, content: :star_struck, author: facilitator, retrospective: retrospective)
    reflection.tasks.create!(author: facilitator, assignee: facilitator, description: 'my task')

    logged_in_as(retrospective.facilitator)
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
