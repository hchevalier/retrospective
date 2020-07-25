module ApplicationHelper
  def consume_invitation(account)
    invitation = PendingInvitation.find_by(id: session[:invitation])
    if invitation&.email == account.email
      invitation.group.add_member(account)
      invitation.destroy
      session.delete(:invitation)
    end
  end
end
