# frozen_string_literal: true

class Api::PendingInvitationsController < ApplicationController
  def update
    invitation = PendingInvitation.find_by(id: params[:id])

    if invitation&.email == current_account.email
      invitation.group.add_member(current_account)
      invitation.destroy
      return render json: :ok
    elsif !invitation
      return render json: :ok
    end
  end
end
