# frozen_string_literal: true

module FactoriesHelpers
  def write_reflection(zone: 'Mad', content: 'This is my reflection')
    click_on 'New reflection'
    fill_in 'content', with: content
    click_on 'Choose zone'
    assert_selector '.zone.mode-assigning-reflection'
    find('.zone', text: zone).click
  end
end
