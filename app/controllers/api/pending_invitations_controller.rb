class Api::PendingInvitationsController < ApplicationController
  def update
    invitation = PendingInvitation.find_by(id: params[:id])
    if invitation&.email == current_account.email
      invitation.group.add_member(current_account)
      invitation.destroy
    elsif !invitation
      return render json: :ok
    end

    # Invitation is intended for another account, forcing logout so that the user can login with the correct one
    session[:account_id] = nil
    cookies.signed[:participant_id] = nil
    render json: { status: :forbidden }, status: :forbidden
  end
end
