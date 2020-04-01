require 'test_helper'

class RetrospectivesTest < ActionDispatch::IntegrationTest
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

    refute_text 'Join'
    assert_text 'Timer'
  end

  test 'only organizer can see the button to start the retrospective' do
    retrospective = create_retrospective!
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_text 'Timer'
    assert_button 'Next'

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)
    assert_text 'Timer'
    refute_button 'Next'
  end

  test 'sees new participant joining' do
    retrospective = create_retrospective!

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_text 'Timer'
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

  test 'can trigger the thinking step for other participants' do
    retrospective = create_retrospective!
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    refute_text 'Glad'

    new_window = open_new_window
    within_window(new_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_text 'Timer'
      refute_text 'Glad'
    end

    click_on 'Next'
    assert_text 'Glad'

    within_window(new_window) do
      assert_text 'Glad'
    end
  end

  private

  def create_retrospective!
    @organizer = Participant.create(surname: 'Organizer', email: 'organizer@yopmail.com')
    Retrospective.create!(
      name: 'Retrospective',
      kind: 'glad_sad_mad',
      participants: [@organizer]
    )
  end

  def add_another_participant(retrospective, surname:, email:)
    retrospective.participants.create!(surname: surname, email: email)
  end

  def logged_in_as(participant)
    ActionDispatch::Cookies::SignedKeyRotatingCookieJar
      .any_instance.expects(:[])
      .with(:user_id)
      .at_least_once
      .returns(participant.id)
  end

  def logged_out
    ActionDispatch::Cookies::SignedKeyRotatingCookieJar
      .any_instance.expects(:[])
      .with(:user_id)
      .at_least_once
      .returns(nil)
  end
end
