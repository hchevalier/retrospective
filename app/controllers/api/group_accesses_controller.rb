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
    group_access = current_account.group_accesses.find(params[:id])

    group_access.update!(revoked_at: Time.current)

    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
  end
end
