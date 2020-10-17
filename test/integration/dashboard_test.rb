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
    assert_text 'Glad sad mad with MyGroupName'
  end

  test 'does not display retrospective the user did not took part in even if he was part of the group' do
    other_retrospective = create(:retrospective, kind: :sailboat, group: @group, created_at: 2.hours.ago)
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
    refute_text 'Glad sad mad with MyGroupName'

    @retrospective.group.add_member(@account)
    visit '/'
    assert_text 'Glad sad mad with MyGroupName'
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
    refute_text 'Glad sad mad with MyGroupName'

    click_on 'SEE ALL'
    assert_text 'Glad sad mad with MyGroupName'
  end

  test 'displays current retrospective when any' do
    freeze_time do
      @retrospective.update!(created_at: 89.minutes.ago)

      visit '/'
      assert_text 'Current retrospective'
      assert_text 'A Glad sad mad retrospective was started with MyGroupName', normalize_ws: true

      @retrospective.update!(created_at: 90.minutes.ago)
      visit '/'
      refute_text 'Current retrospective'
      refute_text 'A Glad sad mad retrospective was started with MyGroupName'
    end
  end

  test 'displays the list of scheduled retrospectives' do
    freeze_time do
      first_monday = Time.current.beginning_of_month.beginning_of_week
      visit "/groups/#{@group.id}"
      find('.react-datetime-picker__calendar-button').click
      assert_selector '.react-calendar__tile'
      find('.react-calendar__tile', match: :first).click
      assert_field 'day', with: first_monday.strftime('%-d')
      assert_field 'month', with: first_monday.strftime('%-m')
      assert_field 'year', with: first_monday.strftime('%Y')
      find_field('hour24').native.clear
      find_field('hour24').native.send_keys(:numpad1, :numpad2)
      find_field('minute').native.clear
      find_field('minute').native.send_keys(:numpad3, :numpad0)

      visit '/'
      assert_text "#{first_monday.strftime('%d/%m')} at 12:30 with MyGroupName"
    end
  end
end
