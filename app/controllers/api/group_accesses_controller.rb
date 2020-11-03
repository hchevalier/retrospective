class Api::GroupAccessesController < ApplicationController
  def index
    active_accesses =
      current_account
        .group_accesses
        .active
        .includes(:account, group: [:accounts_without_revoked, :pending_invitations, :pending_tasks])

    render json: active_accesses.map(&:as_json)
  end

  def destroy
    account_to_revoke_access = current_account
    account_public_id = params[:account_id]

    account_to_revoke_access = Account.find_by(public_id: account_public_id) if other_account?(account_public_id)
    group_access = account_to_revoke_access.group_accesses.find_by(group_id: params[:id])

    revoke_access(group_access)
  end

  private

  def revoke_access(group_access)
    group_access.update!(revoked_at: Time.current)
    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
  end

  def other_account?(account_public_id)
    current_account.public_id != account_public_id
  end
end
