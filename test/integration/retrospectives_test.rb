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

    assert_text 'Lobby'
    refute_text 'Join'
  end

  test 'only organizer can see the button to start the retrospective' do
    retrospective = create_retrospective!
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_text 'Lobby'
    assert_button 'Next'

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)
    assert_text 'Lobby'
    refute_button 'Next'
  end

  test 'sees new participant joining' do
    retrospective = create_retrospective!

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_text 'Lobby'
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
      assert_text 'Lobby'
      refute_text 'Glad'
    end

    click_on 'Next'
    assert_text 'Glad'

    within_window(new_window) do
      assert_text 'Glad'
    end
  end

  test 'can write a retrospective and assign it to a zone' do
    retrospective = create_retrospective!(step: 'thinking')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_text 'Glad'
    refute_text 'Glad (1)'
    write_reflection(zone: 'Glad', content: 'This is my reflection')
    assert_text 'Glad (1)'
  end

  test 'a participant cannot see reflections written by other participants' do
    retrospective = create_retrospective!(step: 'thinking', with_reflection: true)
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)

    assert_text 'Glad'
    refute_text 'Glad (1)'
    find('.zone', text: 'Glad').click
    assert_text 'CLOSE'
    refute_text 'I am so glad!'
  end

  test 'can list reflections from a zone' do
    retrospective = create_retrospective!(step: 'thinking', with_reflection: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    refute_text 'I am so glad!'
    find('.zone', text: 'Glad (1)').click
    assert_text 'I am so glad!'
  end

  test 'can edit a reflection' do
    retrospective = create_retrospective!(step: 'thinking', with_reflection: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    find('.zone', text: 'Glad (1)').click
    assert_text 'I am so glad!'
    click_on 'Edit'

    assert_field 'content', with: 'I am so glad!'
    fill_in 'content', with: 'I am still glad!'
    click_on 'Update'

    refute_text 'Update'
    assert_text 'I am still glad!'
  end

  test 'can delete a reflection' do
    retrospective = create_retrospective!(step: 'thinking', with_reflection: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    find('.zone', text: 'Glad (1)').click
    assert_text 'I am so glad!'
    click_on 'Delete'

    assert_text 'Glad'
    refute_text 'Glad (1)'
  end

  private

  def create_retrospective!(step: 'gathering', with_reflection: false)
    @organizer = Participant.create(surname: 'Organizer', email: 'organizer@yopmail.com')
    retrospective = Retrospective.create!(
      name: 'Retrospective',
      kind: 'glad_sad_mad',
      step: step,
      participants: [@organizer]
    )

    if with_reflection
      glad_zone = retrospective.zones.find_by(identifier: 'Glad')
      @organizer.reflections.create!(zone: glad_zone, content: 'I am so glad!')
    end

    retrospective
  end

  def add_another_participant(retrospective, surname:, email:)
    retrospective.participants.create!(surname: surname, email: email)
  end

  def write_reflection(zone: 'Mad', content: 'This is my reflection')
    click_on 'New reflection'
    fill_in 'content', with: content
    click_on 'Choose zone'
    assert_selector '.zone.mode-assigning-reflection'
    find('.zone', text: zone).click
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
