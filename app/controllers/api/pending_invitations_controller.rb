# frozen_string_literal: true

class Api::PendingInvitationsController < ApplicationController
  def index
    render json: current_group.pending_invitations.map(&:as_json)
  end

  def create
    pending_invitations = current_group.pending_invitations.pluck(:email)

    params[:emails].split(',').each do |email|
      email.strip!
      next if pending_invitations.include?(email) || !valid_email?(email)

      current_group.pending_invitations.create(
        account: current_account,
        email: email,
        retrospective_id: params[:retrospective_id]
      )
    end
  end

  def update
    invitation = PendingInvitation.find_by(id: params[:id])

    if invitation&.email == current_account.email
      invitation.group.add_member(current_account)
      invitation.destroy
      return render json: :ok
    elsif !invitation
      return render json: :ok
    end

    # Invitation is intended for another account, forcing logout so that the user can login with the correct one
    session[:account_id] = nil
    cookies.signed[:participant_id] = nil
    render json: { status: :forbidden }, status: :forbidden
  end

  def destroy
    current_group.pending_invitations.find(params[:id]).destroy
  end

  private

  def current_group
    current_account.groups.find(params[:group_id])
  end
end
