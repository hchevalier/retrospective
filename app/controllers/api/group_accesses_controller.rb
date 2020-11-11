# frozen_string_literal: true

class Api::GroupAccessesController < ApplicationController
  def index
    active_accesses =
      current_account
        .group_accesses
        .active
        .includes(:account, group: %i[accounts_without_revoked pending_invitations pending_tasks])

    render json: active_accesses.map(&:as_json)
  end

  def destroy
    group = current_account.groups.find_by(id: params[:group_id])
    unless group
      return render(json: { error: 'Current user cannot access to the group or group not found.' }, status: :forbidden)
    end

    account = group.accounts.find_by(public_id: params[:id])
    return render(json: { error: 'Account not found in the group.' }, status: :not_found) unless account

    group_access = group.group_accesses.where(revoked_at: nil).find_by(account_id: account.id)
    return render(json: { error: 'Account does not have access to the group.' }, status: :not_found) unless group_access

    group_access.update!(revoked_at: Time.current)
    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
    render json: { status: :ok }
  end
end
