# frozen_string_literal: true

class Api::PendingInvitationsController < ApplicationController
  def index
    pending_invitations =
      PendingInvitation
        .where(email: current_account.email)
        .includes(:account, group: %i[accounts_without_revoked pending_invitations pending_tasks])

    render json: pending_invitations.map(&:as_json)
  end

  def update
    invitation = PendingInvitation.find_by(id: params[:id])

    if invitation&.email == current_account.email
      invitation.group.add_member(current_account)
      invitation.destroy
      render json: :ok
    elsif !invitation
      render json: :ok
    end
  end
end
