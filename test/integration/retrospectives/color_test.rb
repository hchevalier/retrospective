require 'test_helper'

class Retrospective::ColorTest < ActionDispatch::IntegrationTest
  test 'can choose a color' do
    color = Participant::ALL_COLORS.first
    next_color = Participant::ALL_COLORS.second

    retrospective = create_retrospective!(color: color)
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
end
