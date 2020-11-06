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
    byebug
    # return if params[:id].blank? || params[:account].blank?

    # if leave?
    #   group_access = account_group_access
    # elsif account_group_access && revoke?
    #     account = Account.find_by(public_id: params[:account])
    #     group_access = account.group_accesses.find(params[:id])
    # end

    account = Account.find_by(public_id: params[:account])

    group_access = account.group_accesses.find(params[:id])
    revoke_access(group_access)
  end

  private

  def account_group_access
    group_access = current_account.group_accesses.find(params[:id])
    raise if group_access.nil?
  end

  def leave?
    current_account.publicId == params[:account]
  end

  def revoke?
    current_account.publicId != params[:account]
  end

  def revoke_access(group_access)
    group_access.update!(revoked_at: Time.current)
    group_access.group.update!(deleted_at: Time.current) if group_access.group.accounts_without_revoked.count.zero?
  end
end
