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
    retrospective =
      Retrospective.create!(
        name: 'Retrospective',
        kind: 'glad_sad_mad',
        participants: [Participant.create(surname: 'Surname', email: 'email@yopmail.com')]
      )

    visit retrospective_path(retrospective)
    assert_text 'Surname'

    fill_in 'surname', with: 'New participant'
    fill_in 'email', with: 'other_email@yopmail.com'
    click_on 'Join'

    assert_text 'New participant'
  end
end
