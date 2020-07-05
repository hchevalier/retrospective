class GroupAccessesController < ApplicationController
  def index
    render json: current_account.group_accesses.active.map(&:as_json)
  end

  def destroy
    group_access = current_account.group_accesses.find(params[:id])

    group_access.update!(revoked_at: Time.current)

    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
  end
end
