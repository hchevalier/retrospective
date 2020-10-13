require 'test_helper'

class DashboardTest < ActionDispatch::IntegrationTest
  setup do
    @group = create(:group, name: 'MyGroupName')
    @retrospective = create(:retrospective, group: @group)
    participant = @retrospective.participants.first
    @account = participant.account
    reflection = create(:reflection, :glad, retrospective: @retrospective, owner: participant)
    create(:task, reflection: reflection, description: 'My simple task')
    create(:task, reflection: reflection, description: 'My blocked task', status: :on_hold)
    create(:task, reflection: reflection, description: 'My finished simple task', status: :done)
    create(:task, reflection: reflection, description: 'My skipped hard task', status: :wont_do)
    as_user(@account)
  end

  test 'displays pending tasks assigned to the user' do
    visit '/'
    assert_text 'My simple task'
    assert_text 'My blocked task'
    refute_text 'My finished simple task'
    refute_text 'My skipped hard task'
  end

  test 'does not display pending tasks assigned to the user if he has no active access to the group' do
    @retrospective.group.group_accesses.update_all(revoked_at: 1.hour.ago)
    visit '/'
    refute_text 'My simple task'

    @retrospective.group.add_member(@account)
    visit '/'
    assert_text 'My simple task'
  end

  test 'displays retrospective the user took part in' do
    visit '/'
    assert_text 'glad_sad_mad with MyGroupName'
  end

  test 'does not display retrospective the user did not took part in even if he was part of the group' do
    other_retrospective = create(:retrospective, kind: :sailboat, group: @group)
    new_account = other_retrospective.participants.first.account

    visit '/'
    refute_text 'sailboat with MyGroupName'

    as_user(new_account)

    visit '/'
    assert_text 'sailboat with MyGroupName'
  end

  test 'does not display retrospective the user took part in if he has no active access to the group' do
    @retrospective.group.group_accesses.update_all(revoked_at: 1.hour.ago)
    visit '/'
    refute_text 'glad_sad_mad with MyGroupName'

    @retrospective.group.add_member(@account)
    visit '/'
    assert_text 'glad_sad_mad with MyGroupName'
  end

  test 'displays more retrospectives with the SEE ALL button' do
    retrospective = create(:retrospective, kind: :sailboat, group: @group)
    create(:participant, retrospective: retrospective, account: @account, surname: 'Participator')
    retrospective = create(:retrospective, kind: :sailboat, group: @group)
    create(:participant, retrospective: retrospective, account: @account, surname: 'Participator')
    retrospective = create(:retrospective, kind: :sailboat, group: @group)
    create(:participant, retrospective: retrospective, account: @account, surname: 'Participator')

    visit '/'
    assert_text 'sailboat with MyGroupName', count: 3
    refute_text 'glad_sad_mad with MyGroupName'

    click_on 'SEE ALL'
    assert_text 'glad_sad_mad with MyGroupName'
  end

  test 'displays current retrospective when any' do
    freeze_time do
      @retrospective.update!(created_at: 89.minutes.ago)

      visit '/'
      assert_text 'Current retrospective'
      assert_text 'A glad_sad_mad retrospective was started with MyGroupName', normalize_ws: true

      @retrospective.update!(created_at: 90.minutes.ago)
      visit '/'
      refute_text 'Current retrospective'
      refute_text 'A glad_sad_mad retrospective was started with MyGroupName'
    end
  end

  test 'displays the list of scheduled retrospectives' do
    travel_to Time.zone.local(2020, 12, 24, 12, 00, 00) do
      @account.accessible_groups.first.update!(next_retrospective: 1.day.from_now)

      visit '/'
      assert_text "25/12 with MyGroupName"
    end
  end
end
