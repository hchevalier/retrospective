class Api::GroupAccessesController < ApplicationController
  def index
    active_accesses =
      current_account
        .group_accesses
        .active
        .includes(:account, group: [:accounts_without_revoked, :pending_invitations, :pending_tasks])

    render json: active_accesses.map(&:as_json)
  end

  def update
    account = Account.find_by(public_id: params[:account_id])
    group_access = GroupAccess.find_by(group_id: params[:id], account_id: account.id)

    revoke_access(group_access)
  end

  def destroy
    group_access = current_account.group_accesses.find(params[:id])

    revoke_access(group_access)
  end

  private

  def revoke_access(group_access)
    group_access.update!(revoked_at: Time.current)
    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
  end
end
