require 'test_helper'

class GroupsTest < ActionDispatch::IntegrationTest
  setup do
    @account = create(:account)
    as_user(@account)
  end

  test 'creating a group makes account automatically join it' do
    visit '/groups'
    click_on 'Create a group', match: :first

    fill_in 'group_name', with: '8357 620UP'
    click_on 'Create'

    assert_text 'My groups', count: 2
    assert_text '8357 620UP'

    assert_includes Group.last.accounts_without_revoked.ids, @account.id
  end

  test 'shows the number of members in a group' do
    group = create(:group, name: '8357 620UP')
    group.accounts << @account

    visit '/groups'
    assert_text '8357 620UP (1 members)'

    other_account = create(:account, username: 'Other member')
    group.accounts << other_account

    visit '/groups'
    assert_text '8357 620UP (2 members)'

    group.group_accesses.find_by(account: other_account).update!(revoked_at: Time.current)

    visit '/groups'
    assert_text '8357 620UP (1 members)'
  end

  test 'hides groups that have been left' do
    group = create(:group, name: '8357 620UP')
    group.accounts << @account

    visit '/groups'
    assert_text '8357 620UP (1 members)'

    accept_confirm do
      find('.leave-link').click
    end

    refute_text '8357 620UP'

    refute_nil group.group_accesses.find_by(account: @account).revoked_at
  end

  test 'deletes abandoned groups' do
    group = create(:group, name: '8357 620UP')
    group.accounts << @account

    other_account = create(:account, username: 'Other member')
    group.accounts << other_account

    visit '/groups'
    assert_text '8357 620UP (2 members)'

    accept_confirm do
      find('.leave-link').click
    end
    refute_text '8357 620UP'

    as_user(other_account)

    visit '/groups'
    assert_text '8357 620UP (1 members)'

    accept_confirm do
      find('.leave-link').click
    end
    refute_text '8357 620UP'

    refute_nil group.reload.deleted_at
  end
end
