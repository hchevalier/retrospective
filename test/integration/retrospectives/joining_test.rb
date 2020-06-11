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
    fill_in 'password_confirmation', with: 'mypassword'
    click_on 'Create account'

    assert_text 'Other one'
  end

  test 'joins an existing retrospective by logging in to an existing account' do
    retrospective = create(:retrospective)
    create(:account, username: 'Other one', email: 'other_one@yopmail.com', password: 'mypasword', password_confirmation: 'mypasword')

    visit retrospective_path(retrospective)
    assert_text 'Organizer'

    fill_in 'email', with: 'other_one@yopmail.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Login'

    assert_text 'Other one'
  end

  test 'can join a retrospective without loging in again' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_logged_as_organizer
    refute_text 'Join'
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
      fill_in 'password_confirmation', with: 'mypassword'
      click_on 'Create account'
    end

    assert_text 'Other one'
  end
end
