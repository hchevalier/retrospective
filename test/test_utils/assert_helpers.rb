module AssertHelpers
  def assert_logged_in(participant, with_flags: nil)
    within ".participant[data-id='#{participant.id}']" do
      assert_css '.participant-status.logged-in'
      return unless with_flags

      if with_flags == :none
        refute_text 'you'
        refute_text 'orga.'
        refute_text 'reveal.'
      else
        assert_text with_flags
      end
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
      rgba_color = hex_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
      find('.sticky-bookmark', style: %r(#{rgba_color.join(', ')}) )
    end
  end
end
