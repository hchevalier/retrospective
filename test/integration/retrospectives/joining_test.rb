require 'test_helper'

class Retrospective::JoiningTest < ActionDispatch::IntegrationTest
  test 'creates a new retrospective' do
    visit '/'
    assert_text 'You'

    fill_in 'surname', with: 'Surname'
    fill_in 'email', with: 'email@yopmail.com'
    fill_in 'retrospective_name', with: 'Retrospective'
    material_ui_select 'glad_sad_mad', from: 'retrospective_kind'
    click_on 'Start retrospective'

    assert_text 'Lobby Retrospective'
  end

  test 'joins an existing retrospective' do
    retrospective = create_retrospective!

    visit retrospective_path(retrospective)
    assert_text 'Organizer'

    fill_in 'surname', with: 'Other one'
    fill_in 'email', with: 'other_one@yopmail.com'
    click_on 'Join'

    assert_text 'Other one'
  end

  test 'can join a retrospective without loging in again' do
    retrospective = create_retrospective!

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_logged_as_organizer
    refute_text 'Join'
  end

  test 'only organizer can see the button to start the retrospective' do
    retrospective = create_retrospective!
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    assert_button 'Next'

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)
    refute_logged_as_organizer
    refute_button 'Next'
  end

  test 'sees new participant joining' do
    retrospective = create_retrospective!

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_logged_as_organizer
    refute_text 'Other one'

    within_window(open_new_window) do
      logged_out
      visit retrospective_path(retrospective)
      fill_in 'surname', with: 'Other one'
      fill_in 'email', with: 'other_one@yopmail.com'
      click_on 'Join'
    end

    assert_text 'Other one'
  end
end
