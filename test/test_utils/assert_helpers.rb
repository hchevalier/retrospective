module AssertHelpers
  def assert_logged_in(participant, with_flags: nil)
    within ".avatar[data-id='#{participant.id}']" do
      assert_css '.status-indicator.logged-in'
      return unless with_flags

      if with_flags.empty?
        refute_selector '.facilitator'
        refute_selector '.revealer'
      else
        with_flags.each do |flag|
          case flag
          when :facilitator
            assert_selector '.facilitator'
          when :revealer
            assert_selector '.revealer'
          end
        end
      end
    end

    refute_selector(".avatar[data-id='#{participant.id}'].self") if with_flags.empty?
    assert_selector(".avatar[data-id='#{participant.id}'].self") if with_flags.include?(:self)
  end

  def assert_inactive(participant, with_flags: nil)
    within ".avatar[data-id='#{participant.id}']" do
      assert_css '.status-indicator'
      refute_css '.logged-in'
      assert_text with_flags if with_flags
    end
  end

  def assert_logged_as_facilitator
    within '#participants-list' do
      assert_selector('.avatar.self .facilitator')
    end
  end

  def refute_logged_as_facilitator
    within '#participants-list' do
      assert_selector('.avatar.self')
      refute_selector('.avatar.self .facilitator')
    end
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
    rgba_color = hex_color.scan(/[0-9a-f]{2}/).map { |color| color.to_i(16) }
    find(".avatar[data-id='#{participant.id}']", style: %r(#{rgba_color.join(', ')}) )
  end
end
