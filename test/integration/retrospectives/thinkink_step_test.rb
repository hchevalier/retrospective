require 'test_helper'

class Retrospective::ThinkingStepTest < ActionDispatch::IntegrationTest
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
end
