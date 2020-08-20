class PendingInvitation < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :account
  belongs_to :group
  belongs_to :retrospective, optional: true

  after_create_commit :send_invitation

  def as_json
    {
      createdAt: created_at,
      email: email,
      id: id
    }
  end

  def link(host)
    retrospective ?
      retrospective_url(id: retrospective_id, invitation_id: id, host: host) :
      single_page_app_url(path: "groups/#{group.id}", invitation_id: id, host: host)
  end

  def deprecaded?
    created_at < 24.hours.ago
  end

  private

  def send_invitation
    InvitationMailer.send_invitation(invitation: self).deliver_later
  end
end