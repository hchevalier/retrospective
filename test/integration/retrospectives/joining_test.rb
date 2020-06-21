require 'test_helper'

class Retrospective::JoiningTest < ActionDispatch::IntegrationTest
  test 'creates a new retrospective' do
    account = create(:account)
    as_user(account)

    visit '/'
    assert_text 'Dashboard'
    click_on 'Create a retrospective'

    fill_in 'retrospective_name', with: 'Retrospective'
    select 'glad_sad_mad', from: 'retrospective_kind'
    click_on 'Start retrospective'

    assert_text 'Lobby Retrospective'
  end

  test 'joins an existing retrospective by creating an account' do
    retrospective = create(:retrospective)

    visit retrospective_path(retrospective)
    assert_text 'Organizer'

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
    assert_text 'Organizer'

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

    assert_text 'Organizer'
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

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_logged_as_organizer
    refute_button 'Login'
  end

  test 'only organizer can see the button to start the retrospective' do
    retrospective = create(:retrospective)
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    assert_button 'Next'

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)
    refute_logged_as_organizer
    refute_button 'Next'
  end

  test 'sees new participant joining' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_logged_as_organizer
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
