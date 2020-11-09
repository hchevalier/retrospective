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
    group = current_account.groups.find(params[:group_id])
    account = group.accounts.find_by(public_id: params[:id])
    return render(json: { status: :not_found }) unless account

    group_access = group.group_accesses.find_by(account_id: account.id)
    return render(json: { status: :not_found }) unless group_access

    group_access.update!(revoked_at: Time.current)
    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
    render json: current_account.accessible_groups.map(&:as_short_json)
  rescue ActiveRecord::RecordNotFound
    render json: 'record not found for delete', status: :not_found
  end
end
