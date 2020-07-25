class InvitationMailer < ApplicationMailer
  def send_invitation(invitation: nil)
    @invitation = invitation || params&.fetch(:invitation, nil)
    raise unless @invitation

    host = 'https://docto-retrospective.herokuapp.com'
    @link = @invitation.link(host)

    mail(to: @invitation.email, subject: "Invitation to retrospective group #{@invitation.group.name}")
  end
end
