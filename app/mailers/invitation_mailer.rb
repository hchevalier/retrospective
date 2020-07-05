class InvitationMailer < ApplicationMailer
  def send_invitation(invitation: nil)
    @invitation = invitation || params&.fetch(:invitation, nil)
    raise unless @invitation

    host = 'https://docto-retrospective.herokuapp.com'
    @link =
      @invitation.retrospective ?
      retrospective_url(id: @invitation.retrospective_id, invitation_id: @invitation.id, host: host) :
      spa_group_url(id: @invitation.group.id, invitation_id: @invitation.id, host: host)

    mail(to: @invitation.email, subject: "Invitation to retrospective group #{@invitation.group.name}")
  end
end
