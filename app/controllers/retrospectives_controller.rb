class RetrospectivesController < ApplicationController
  def create
    organizer = Participant.new(surname: 'The Organizer', email: 'organizer@doctolib.com')
    Retrospective.create(**retrospective_params, participants: [organizer])
  end

  private

  def retrospective_params
    params.require(:retrospective).permit(:name, :kind)
  end
end

