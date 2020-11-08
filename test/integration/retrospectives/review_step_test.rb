# frozen_string_literal: true

require 'test_helper'

class Retrospective::ReviewStepTest < ActionDispatch::IntegrationTest
  test 'dispays an additional step to change actions statuses when there are pending tasks' do
    previous_retrospective = create(:retrospective)
    assignee = previous_retrospective.facilitator
    account = assignee.account
    something = create(:task, {
      reflection: create(:reflection, :glad, retrospective: previous_retrospective, owner: assignee),
      description: 'Something to do',
      author: assignee,
      assignee: account
    })
    something_else = create(:task, {
      reflection: create(:reflection, :glad, retrospective: previous_retrospective, owner: assignee),
      description: 'Something else to do',
      author: assignee,
      assignee: account
    })

    as_user(account)

    retrospective = create(:retrospective, group: account.groups.first, facilitator: build(:participant, account: account))
    other_participant = create(:other_participant, retrospective: retrospective)
    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_logged_in(retrospective.facilitator, with_flags: %i[self facilitator])
    next_step

    assert_selector '.task'

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(other_participant, with_flags: %i[self])
      within ".task[data-id='#{something.id}']" do
        assert_selector 'div.selected', text: 'TODO'
      end
    end

    within ".task[data-id='#{something.id}']" do
      assert_text 'Something to do'
      assert_changes -> { something.reload.status }, from: 'todo', to: 'done' do
        find('div', exact_text: 'DONE').click
        assert_selector 'div.selected', text: 'DONE'
      end
    end

    within_window(other_participant_window) do
      within ".task[data-id='#{something.id}']" do
        assert_selector 'div.selected', text: 'DONE'
      end
    end

    within ".task[data-id='#{something_else.id}']" do
      assert_text 'Something else to do'
      assert_changes -> { something_else.reload.status }, from: 'todo', to: 'wont_do' do
        find('div', exact_text: 'WON\'T DO').click
        assert_selector 'div.selected', exact_text: 'WON\'T DO'
      end

      assert_changes -> { something_else.reload.status }, from: 'wont_do', to: 'on_hold' do
        find('div', exact_text: 'ON HOLD').click
        assert_selector 'div.selected', exact_text: 'ON HOLD'
      end

      assert_changes -> { something_else.reload.status }, from: 'on_hold', to: 'todo' do
        find('div', exact_text: 'TODO').click
        assert_selector 'div.selected', exact_text: 'TODO'
      end
    end

    logged_out
  end
end
