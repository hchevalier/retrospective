# Preview all emails at http://localhost:3000/rails/mailers/invitation_mailer
class InvitationMailerPreview < ActionMailer::Preview
  def send_invitation
    invitation = PendingInvitation.first
    InvitationMailer.with(invitation: invitation).send_invitation
  end
end
