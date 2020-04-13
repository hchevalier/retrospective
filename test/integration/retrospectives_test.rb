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

  test 'can choose a color' do
    color = Participant::ALL_COLORS.first
    next_color = Participant::ALL_COLORS.second

    Retrospective.any_instance.stubs(:available_colors).returns([color])

    retrospective = create_retrospective!
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_has_color(@organizer, color)

    other_partipant_window = open_new_window
    within_window(other_partipant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_has_color(@organizer, color)
    end

    logged_in_as(@organizer)
    find(".color-square[data-color='#{next_color}']").click
    assert_has_color(@organizer, next_color)

    within_window(other_partipant_window) do
      assert_has_color(@organizer, next_color)
    end
  end

  test 'can trigger the thinking step for other participants' do
    retrospective = create_retrospective!
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    refute_retro_started

    new_window = open_new_window
    within_window(new_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      refute_logged_as_organizer
      refute_retro_started
    end

    click_on 'Next'
    assert_retro_started

    within_window(new_window) do
      assert_retro_started
    end
  end

  test 'can write a reflection and assign it to a zone' do
    retrospective = create_retrospective!(step: 'thinking')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_retro_started
    refute_reflection_in_zone('Glad')
    write_reflection(zone: 'Glad', content: 'This is my reflection')
    assert_reflection_in_zone('Glad')
  end

  test 'a participant cannot see reflections written by other participants' do
    retrospective = create_retrospective!(step: 'thinking', with_reflection: true)
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)

    assert_retro_started
    refute_reflection_in_zone('Glad')
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

    assert_retro_started
    refute_reflection_in_zone('Glad')
  end

  test 'timer does not show in waiting lobby even when organizer' do
    retrospective = create_retrospective!

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    refute_logged_as_organizer
    assert_no_css('#timer')
  end

  test 'timer displays 10:00 for organizer by default' do
    retrospective = create_retrospective!(step: 'thinking')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_equal 'Timer:10:00', find('#timer').text.split("\n").join
  end

  test 'timer does not show for other participants if not running' do
    retrospective = create_retrospective!(step: 'thinking')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)

    refute_logged_as_organizer
    assert_no_css('#timer')
  end

  test 'organizer can set timer for all participants' do
    retrospective = create_retrospective!(step: 'thinking')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    find('#timer .minutes').click
    assert_text 'Set duration'
    find('span.MuiListItemText-primary', text: '08mn').click
    refute_text 'Set duration'

    # Waits for 07:59, then only have 1 second to do the following assertion
    # Risks of flakiness
    within '#timer' do
      assert_text '59'
    end
    assert_equal 'Timer:07:59', find('#timer').text.split("\n").join

    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_text '58'
      assert_equal 'Timer:07:58', find('#timer').text.split("\n").join
    end
  end

  test 'organizer token changes when original organizer logs out or re-logs in' do
    retrospective = create_retrospective!(step: 'thinking')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    organizer_window = open_new_window
    within_window(organizer_window) do
      logged_in_as(@organizer)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(you, orga.)')
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(orga.)')
      assert_logged_in(other_participant, with_flags: '(you)')
    end

    assert_performed_with(job: InactivityJob, args: [@organizer]) do
      organizer_window.close
    end

    within_window(other_participant_window) do
      assert_inactive(@organizer)
      assert_logged_in(other_participant, with_flags: '(you, orga.)')
    end

    within_window(open_new_window) do
      logged_in_as(@organizer)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(you, orga.)')
      assert_logged_in(other_participant)
    end

    within_window(other_participant_window) do
      assert_logged_in(@organizer, with_flags: '(orga.)')
      assert_logged_in(other_participant, with_flags: '(you)')
    end
  end

  private

  def create_retrospective!(step: 'gathering', with_reflection: false)
    retrospective = Retrospective.create!(
      name: 'Retrospective',
      kind: 'glad_sad_mad',
      step: step,
      organizer_attributes: { surname: 'Organizer', email: 'organizer@yopmail.com' }
    )
    @organizer = retrospective.organizer

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

  def assert_logged_in(participant, with_flags: nil)
    within ".participant[data-id='#{participant.id}']" do
      assert_css '.participant-status.logged-in'
      assert_text with_flags if with_flags
    end
  end

  def assert_inactive(participant, with_flags: nil)
    within ".participant[data-id='#{participant.id}']" do
      assert_css '.participant-status'
      refute_css '.logged-in'
      assert_text with_flags if with_flags
    end
  end

  def assert_logged_as_organizer
    assert_text '(you, orga.)'
  end

  def refute_logged_as_organizer
    assert_text '(you)'
  end

  def assert_retro_started
    assert_text 'Glad'
  end

  def refute_retro_started
    refute_text 'Glad'
  end

  def assert_reflection_in_zone(zone, count: 1)
    assert_text "Glad (#{count})"
  end

  def refute_reflection_in_zone(zone, count: 1)
    refute_text "Glad (#{count})"
  end

  def assert_has_color(participant, hex_color)
    within ".participant[data-id='#{participant.id}']" do
      find('.participant-name', style: %r(#{hex_to_decimal(hex_color).join(', ')}) )
    end
  end

  def hex_to_decimal(hex_color)
    hex_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
  end
end
