require 'test_helper'

class Retrospective::JoiningTest < ActionDispatch::IntegrationTest
  test 'creates a new retrospective with an existing group' do
    account = create(:account)
    group = create(:group, name: '8357 620UP')
    group.add_member(account)
    other_group = create(:group, name: '07H32 620UP')
    other_group.add_member(account)
    as_user(account)

    visit '/'
    assert_text 'Dashboard'
    click_on 'Create a retrospective'

    find('input[name="group_name"]').click
    assert_text '8357 620UP'
    assert_text '07H32 620UP'
    find('[name="group_name_dropdown"] div', text: '8357 620UP', match: :first).click
    assert_field 'group_name', with: '8357 620UP'
    refute_text '07H32 620UP'
    find('input[name="group_name"]').click
    fill_in 'group_name', with: '07H32'
    refute_text '8357 620UP'
    assert_text '07H32 620UP'
    assert_text 'Create group "07H32"'
    fill_in 'group_name', with: '07H32 620UP'
    refute_text 'Create group "07H32"'

    select 'glad_sad_mad', from: 'retrospective_kind'
    assert_field 'group_name', with: '8357 620UP'
    refute_text '07H32 620UP'

    click_on 'Start retrospective'

    assert_text 'Lobby 8357 620UP'
  end

  test 'creates a new retrospective with a new group' do
    account = create(:account)
    as_user(account)

    visit '/'
    assert_text 'Dashboard'
    click_on 'Create a retrospective'

    find('input[name="group_name"]').click
    refute_text '8357 620UP'
    fill_in 'group_name', with: '8357 620UP'
    find('[name="group_name_dropdown"] div', text: 'Create group "8357 620UP"', match: :first).click
    select 'glad_sad_mad', from: 'retrospective_kind'
    click_on 'Start retrospective'

    assert_text 'Lobby 8357 620UP'
    account.reload
    visit '/'
    assert_text '8357 620UP - glad_sad_mad'
  end

  test 'joins an existing retrospective by creating an account' do
    retrospective = create(:retrospective)

    visit retrospective_path(retrospective)
    assert_text 'Facilitator'

    click_on "Don't have an account yet?"
    fill_in 'username', with: 'Other one'
    fill_in 'email', with: 'other_one@yopmail.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Create account'

    assert_text 'Other one'
  end

  test 'joins an existing retrospective by logging in to an existing account' do
    retrospective = create(:retrospective)
    create(:account, username: 'Other one', email: 'other_one@yopmail.com', password: 'mypasword')

    visit retrospective_path(retrospective)
    assert_text 'Facilitator'

    fill_in 'email', with: 'other_one@yopmail.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Login'

    assert_text 'Other one'
  end

  test 'joining an existing retrospective and logging in reuses a participant if any' do
    retrospective = create(:retrospective)
    account = create(:account, username: 'Other one', email: 'other_one@yopmail.com', password: 'mypasword')
    participant = create(:participant, retrospective: retrospective, account: account, surname: 'Other one')

    assert_no_difference 'Participant.count' do
      visit retrospective_path(retrospective)
      fill_in 'email', with: 'other_one@yopmail.com'
      fill_in 'password', with: 'mypassword'
      click_on 'Login'
    end

    assert_logged_in(participant, with_flags: %i(self))
  end

  test 'joining an existing retrospective while being logged with an existing account creates a participant' do
    retrospective = create(:retrospective)
    account = create(:account)
    as_user(account)

    assert_difference 'Participant.count' do
      visit retrospective_path(retrospective)
    end

    assert_text 'Facilitator'
    refute_field 'email'
    refute_button 'Login'

    assert account, Participant.last.account
  end

  test 'joining an existing retrospective while being logged with an existing account reuses a participant if any' do
    retrospective = create(:retrospective)
    account = create(:account, username: 'Other one')
    participant = create(:participant, retrospective: retrospective, account: account, surname: 'Other one')
    as_user(account)

    assert_no_difference 'Participant.count' do
      visit retrospective_path(retrospective)
    end

    assert_logged_in(participant, with_flags: %i(self))
    refute_field 'email'
    refute_button 'Login'
  end

  test 'can join a retrospective without loging in again' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    assert_logged_as_facilitator
    refute_button 'Login'
  end

  test 'only facilitator can see the button to start the retrospective' do
    retrospective = create(:retrospective)
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)
    assert_logged_as_facilitator
    assert_button 'Next'

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)
    refute_logged_as_facilitator
    refute_button 'Next'
  end

  test 'sees new participant joining' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.facilitator)
    visit retrospective_path(retrospective)

    assert_logged_as_facilitator
    refute_text 'Other one'

    within_window(open_new_window) do
      logged_out
      visit retrospective_path(retrospective)
      click_on "Don't have an account yet?"
      fill_in 'username', with: 'Other one'
      fill_in 'email', with: 'other_one@yopmail.com'
      fill_in 'password', with: 'mypassword'
      click_on 'Create account'
    end

    assert_text 'Other one'
  end
end
