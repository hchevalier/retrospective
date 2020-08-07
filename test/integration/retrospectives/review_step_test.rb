require 'test_helper'

class Retrospective::ReviewStepTest < ActionDispatch::IntegrationTest
  test 'dispays an additional step to change actions statuses when there are pending tasks' do
    previous_retrospective = create(:retrospective)
    assignee = previous_retrospective.facilitator
    something = create(:task, {
      reflection: create(:reflection, :glad, retrospective: previous_retrospective, owner: assignee),
      description: 'Something to do',
      author: assignee,
      assignee: assignee
    })
    something_else = create(:task, {
      reflection: create(:reflection, :glad, retrospective: previous_retrospective, owner: assignee),
      description: 'Something else to do',
      author: assignee,
      assignee: assignee
    })

    account = assignee.account
    as_user(account)

    retrospective = create(:retrospective, group: account.groups.first, facilitator: build(:participant, account: account))
    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    assert_logged_in(retrospective.facilitator, with_flags: %i(self facilitator))
    click_on 'Next'

    within ".task[data-id='#{something.id}']" do
      assert_text 'Something to do'
      assert_changes -> { something.reload.status }, from: 'todo', to: 'done' do
        click_on 'Done'
        assert_selector '.selected'
      end
    end

    within ".task[data-id='#{something_else.id}']" do
      assert_text 'Something else to do'
      assert_changes -> { something_else.reload.status }, from: 'todo', to: 'stuck' do
        click_on "Won't"
        assert_selector '.selected'
      end

      assert_changes -> { something_else.reload.status }, from: 'stuck', to: 'todo' do
        click_on 'Ask next time'
        assert_selector 'button:last-child.selected'
      end
    end

    logged_out
  end
end
