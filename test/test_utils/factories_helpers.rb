module FactoriesHelpers
  def create_retrospective!(step: 'gathering', with_reflection: false, color: nil)
    retrospective = Retrospective.create!(
      name: 'Retrospective',
      kind: 'glad_sad_mad',
      step: step,
      organizer_attributes: { surname: 'Organizer', email: 'organizer@yopmail.com' }
    )
    @organizer = retrospective.organizer
    @organizer.update!(color: color) if color

    if with_reflection
      glad_zone = retrospective.zones.find_by(identifier: 'Glad')
      @organizer.reflections.create!(zone: glad_zone, content: 'I am so glad!')
    end

    retrospective
  end

  def add_another_participant(retrospective, surname:, email:, color: nil)
    retrospective.participants.create!(surname: surname, email: email, color: color)
  end

  def write_reflection(zone: 'Mad', content: 'This is my reflection')
    click_on 'New reflection'
    fill_in 'content', with: content
    click_on 'Choose zone'
    assert_selector '.zone.mode-assigning-reflection'
    find('.zone', text: zone).click
  end

  def create_reflection(zone:, content:, participant:, revealed: false)
    Zone.find_by(identifier: zone).reflections.create!(content: content, owner: participant, revealed: revealed)
  end
end
