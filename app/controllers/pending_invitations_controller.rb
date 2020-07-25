class PendingInvitationsController < ApplicationController
  def index
    render json: current_group.pending_invitations.map(&:as_json)
  end

  def create
    pending_invitations = current_group.pending_invitations.pluck(:email)
    params[:emails].split(',').each do |email|
      email.strip!
      next if pending_invitations.include?(email)

      current_group.pending_invitations.create(
        account: current_account,
        email: email,
        retrospective_id: params[:retrospective_id]
      )
    end
  end

  def destroy
    current_group.pending_invitations.find(params[:id]).destroy
  end

  private

  def current_group
    current_account.groups.find(params[:group_id])
  end
end
