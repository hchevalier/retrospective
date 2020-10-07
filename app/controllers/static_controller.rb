class StaticController < ApplicationController
  include ApplicationHelper

  skip_before_action :ensure_logged_in, only: :single_page_app
  before_action :check_invitation

  def single_page_app
    consume_invitation(current_account) if session[:invitation] && current_account
  end

  private

  def check_invitation
    return unless params[:invitation_id]

    invitation = PendingInvitation.find_by(id: params[:invitation_id])
    return unless invitation

    if current_account&.email == invitation.email
      invitation.group.add_member(current_account)
      invitation.destroy
      return
    elsif current_account
      session.delete(:account_id)
    end

    session[:invitation] = invitation.id
    redirect_to new_sessions_path(email: invitation.email, return_url: url_for(all_params.except(:invitation_id).merge(only_path: true)))
  end

  def all_params
    params.permit!
  end
end
