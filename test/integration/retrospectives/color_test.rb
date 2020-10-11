# frozen_string_literal: true

require 'test_helper'

class Retrospective::ColorTest < ActionDispatch::IntegrationTest
  test 'participant color is seen by other participants and can be changed' do
    color = Participant::ALL_COLORS.first
    other_color = Participant::ALL_COLORS.second
    clicked_color = Participant::ALL_COLORS.third

    retrospective = create(:retrospective)
    retrospective.facilitator.update!(color: color)
    other_participant = create(:other_participant, retrospective: retrospective, color: other_color)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
    assert_has_color(retrospective.facilitator, color)
    assert_has_color(other_participant, other_color)

    other_partipant_window = open_new_window
    within_window(other_partipant_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_has_color(retrospective.facilitator, color)
      assert_has_color(other_participant, other_color)
    end

    logged_in_as(retrospective.facilitator)
    find(".color-square[data-color='#{clicked_color}']").click
    assert_has_color(retrospective.facilitator, clicked_color)
    assert_has_color(other_participant, other_color)

    within_window(other_partipant_window) do
      assert_has_color(retrospective.facilitator, clicked_color)
      assert_has_color(other_participant, other_color)
    end
  end

  test "sticky notes use their author's color" do
    hex_color = Participant::ALL_COLORS.sample
    retrospective = create(:retrospective, step: 'thinking')
    retrospective.facilitator.update!(color: hex_color)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_retro_started

    rgba_color = hex_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
    assert find('.reflection', style: /#{rgba_color.join(', ')}/)

    other_color = retrospective.available_colors.sample
    refute_equal hex_color, other_color

    other_participant = create(:other_participant, retrospective: retrospective, color: other_color)
    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_retro_started

      rgba_color = other_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
      assert find('.reflection', style: /#{rgba_color.join(', ')}/)
    end
  end
end
