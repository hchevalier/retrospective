require 'test_helper'

class DashboartTest < ActionDispatch::IntegrationTest
  setup do
    @group = create(:group, name: '8357 620UP')
    @retrospective = create(:retrospective, group: @group)
    participant = @retrospective.participants.first
    @account = participant.account
    @group.accounts << @account
    reflection = create(:reflection, :glad, retrospective: @retrospective, owner: participant)
    @task = create(:task, reflection: reflection, description: 'My simple task')
    as_user(@account)
  end

  test 'displays pending tasks assigned to the user' do
    visit '/'
    assert_text 'My simple task'
  end

  test 'does not display pending tasks assigned to the user if he has no active access to the group' do
    @retrospective.group.group_accesses.update_all(revoked_at: 1.hour.ago)
    visit '/'
    refute_text 'My simple task'

    @retrospective.group.accounts << @account
    visit '/'
    assert_text 'My simple task'
  end

  test 'displays retrospective the user took part in' do
    visit '/'
    assert_text '8357 620UP - glad_sad_mad'
  end

  test 'does not display retrospective the user did not took part in even if he was part of the group' do
    other_retrospective = create(:retrospective, kind: :sailboat, group: @group)
    new_account = other_retrospective.participants.first.account
    @group.accounts << new_account

    visit '/'
    refute_text '8357 620UP - sailboat'

    as_user(new_account)

    visit '/'
    assert_text '8357 620UP - sailboat'
  end

  test 'does not display retrospective the user took part in if he has no active access to the group' do
    @retrospective.group.group_accesses.update_all(revoked_at: 1.hour.ago)
    visit '/'
    refute_text '8357 620UP - glad_sad_mad'

    @retrospective.group.accounts << @account
    visit '/'
    assert_text '8357 620UP - glad_sad_mad'
  end
end
