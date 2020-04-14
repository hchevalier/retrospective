require 'test_helper'

class Retrospective::ColorTest < ActionDispatch::IntegrationTest
  test 'participant color is seen by other participants and can be changed' do
    color = Participant::ALL_COLORS.first
    other_color = Participant::ALL_COLORS.second
    clicked_color = Participant::ALL_COLORS.third

    retrospective = create_retrospective!(color: color)
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com', color: other_color)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_has_color(@organizer, color)
    assert_has_color(other_participant, other_color)

    other_partipant_window = open_new_window
    within_window(other_partipant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_has_color(@organizer, color)
      assert_has_color(other_participant, other_color)
    end

    logged_in_as(@organizer)
    find(".color-square[data-color='#{clicked_color}']").click
    assert_has_color(@organizer, clicked_color)
    assert_has_color(other_participant, other_color)

    within_window(other_partipant_window) do
      assert_has_color(@organizer, clicked_color)
      assert_has_color(other_participant, other_color)
    end
  end

  test "sticky notes use their author's color" do
    hex_color = Participant::ALL_COLORS.sample
    retrospective = create_retrospective!(step: 'thinking', color: hex_color)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_retro_started
    click_on 'New reflection'

    rgba_color = hex_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
    assert find('.MuiTextField-root', style: %r(#{rgba_color.join(', ')}) )

    other_color = retrospective.available_colors.sample
    refute_equal hex_color, other_color

    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com', color: other_color)
    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_retro_started
      click_on 'New reflection'

      rgba_color = other_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
      assert find('.MuiTextField-root', style: %r(#{rgba_color.join(', ')}) )
    end
  end
end
