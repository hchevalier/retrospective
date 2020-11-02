# frozen_string_literal: true

require 'test_helper'

class Retrospective::GatheringStepTest < ActionDispatch::IntegrationTest
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

    assert_text 'My reflections'

    rgba_color = hex_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
    assert find('.reflection', style: /#{rgba_color.join(', ')}/)

    other_color = retrospective.available_colors.sample
    refute_equal hex_color, other_color

    other_participant = create(:other_participant, retrospective: retrospective, color: other_color)
    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_text 'My reflections'

      rgba_color = other_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
      assert find('.reflection', style: /#{rgba_color.join(', ')}/)
    end
  end

  test 'participant can compose an avatar' do
    retrospective = create(:retrospective)
    retrospective.facilitator.update!(color: Participant::ALL_COLORS.first)
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_text 'Avatar editor'

    choose_tab_and_piece 'Skin color', '#skin-Tanned'
    click_on 'Hair/Hat'
    choose_tab_and_piece 'Hats', '#top-Eyepatch'
    choose_tab_and_piece 'Short hair', '#top-ShortHairDreads02'
    choose_piece '#hair-color-Red'
    choose_tab_and_piece 'Long hair', '#top-LongHairDreads'
    choose_piece '#hair-color-Black'
    choose_tab_and_piece 'Facial hair', '#facialHair-MoustacheFancy'
    choose_piece '#facial-hair-color-BrownDark'
    choose_tab_and_piece 'Eyes', '#eyes-Surprised'
    choose_tab_and_piece 'Eyebrows', '#eyebrows-RaisedExcitedNatural'
    choose_tab_and_piece 'Mouth', '#mouth-Sad'
    choose_tab_and_piece 'Clothes', '#clothe-GraphicShirt'
    choose_piece '#clothe-color-Blue03'
    choose_tab_and_piece 'Shirt logo', '#graphics-Bear'
    choose_tab_and_piece 'Accessories', '#accessories-Prescription02'

    assert_selector '#editor-avatar-container svg g#Top\/_Resources\/Prescription-02'

    assert_correct_svg(find('#editor-avatar-container svg'))
    assert_correct_svg(find('#participants-list .picture', match: :first).find('svg'))

    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_correct_svg(find('#participants-list .picture', match: :first).find('svg'))
    end
  end

  private

  def assert_correct_svg(selector)
    content = selector['innerHTML'].gsub(/react-(path|mask|filter)-\d+/, '')
    assert_equal '4451e912f35a50290bf29e4016ff0b35b985ec37', Digest::SHA1.hexdigest(content)
  end

  def choose_tab_and_piece(tab, piece)
    click_on tab
    choose_piece piece
  end

  def choose_piece(piece)
    assert_selector piece
    find(piece).click
  end
end
