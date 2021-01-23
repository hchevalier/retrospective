# frozen_string_literal: true

require 'test_helper'

class PendingInvitationsTest < ActionDispatch::IntegrationTest
  test 'can send invitations from a group page' do
    account = create(:account, username: 'Host')
    as_user(account)
    group = create(:group, name: 'Group A')
    group.add_member(account)

    visit "/groups/#{group.id}"
    assert_button 'ADD'
    refute_text 'Pending invitations'

    click_on 'ADD'
    fill_in 'email_addresses', with: 'someone@mycompany.com, someone.else@mycompany.com'
    click_on 'Send invitations'

    assert_text 'Pending invitations'
    assert_text 'someone@mycompany.com'
    assert_text 'someone.else@mycompany.com'

    perform_enqueued_jobs
    email = ActionMailer::Base.deliveries.last
    assert_equal ['noreply@docto-retrospective.herokuapp.com'], email.from
    assert_equal ['someone.else@mycompany.com'], email.to
    assert_equal 'Invitation to retrospective group Group A', email.subject

    invitation = PendingInvitation.order(:created_at).last

    body = email.body.to_s
    link = <<~HTML
      Click on <a href=\"https://docto-retrospective.herokuapp.com/groups/#{group.id}\?email=someone.else%40mycompany.com&amp;invitation_id=#{invitation.id}\">this link</a> to join
    HTML
    assert_match "You've been invited by Host to join the retropective group Group A", body
    assert_match link.squish, body
  end

  test 'can send invitation with uppercase characters in the email and still join the group' do
    account = create(:account, username: 'Host')
    other_account = create(:account, username: 'Joiner', email: 'someone@mycompany.com', password: 'myStr0ngPassword!')

    as_user(account)
    group = create(:group, name: 'Group A')
    group.add_member(account)

    visit "/groups/#{group.id}"

    click_on 'ADD'
    fill_in 'email_addresses', with: 'Someone@MyCompany.com'
    click_on 'Send invitations'

    assert_text 'Pending invitations'
    assert_text 'someone@mycompany.com'

    perform_enqueued_jobs
    invitation = PendingInvitation.order(:created_at).last

    within_window(open_new_window) do
      as_user(other_account)
      visit invitation.link(host_and_port)
      assert_text 'Joiner'
      assert_text 'Group members (2)'
    end
  end

  test 'can cancel an invitation' do
    account = create(:account)
    as_user(account)
    group = create(:group)
    group.add_member(account)
    invitation = create(:pending_invitation, email: 'someone@mycompany.com', group: group, account: account)

    visit "/groups/#{group.id}"
    assert_text 'Pending invitations'
    assert_text 'someone@mycompany.com'

    link = invitation.link(host_and_port)

    find('a', text: 'Cancel invitation').click
    refute_text 'someone@mycompany.com'

    assert_raises ActiveRecord::RecordNotFound do
      invitation.reload
    end
  end

  test 'cannot invite people when domain whitelisting is on and email is not authorized' do
    ApplicationController.stub_const(:AUTHORIZED_DOMAINS, ['@mycompany.com']) do
      account = create(:account, username: 'Host')
      as_user(account)
      group = create(:group, name: 'Group A')
      group.add_member(account)

      visit "/groups/#{group.id}"
      assert_button 'ADD'
      refute_text 'Pending invitations'

      click_on 'ADD'
      fill_in 'email_addresses', with: 'someone@nocompany.com'
      click_on 'Send invitations'

      refute_text 'Pending invitations'
      refute_text 'someone@mycompany.com'

      click_on 'ADD'
      fill_in 'email_addresses', with: 'someone@mycompany.fr, someone.else@mycompany.com'
      click_on 'Send invitations'

      assert_text 'Pending invitations'
      refute_text 'someone@mycompany.com'
      assert_text 'someone.else@mycompany.com'
    end
  end

  test 'using an invitation link prefills the email' do
    invitation = create(:pending_invitation, email: 'someone@mycompany.com', group: create(:group))
    visit invitation.link(host_and_port)

    assert_text 'Log in'
    assert_equal 'someone@mycompany.com', find('input[name="email"]').value
  end

  test 'can join from a group link by already being logged in' do
    group = create(:group)
    invitation = create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group)

    account = create(:account, email: 'newjoiner@mycompany.com', username: 'New joiner')
    as_user(account)

    visit invitation.link(host_and_port)
    assert_text 'New joiner'
    assert_current_path "/groups/#{group.id}"
    refute_text 'Pending invitations'
  end

  test 'can join from a group link by creating a new account' do
    group = create(:group)
    invitation = create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group)

    visit invitation.link(host_and_port)
    click_on "Don't have an account yet?"
    fill_in 'password', with: 'myStr0ngPassword!'
    fill_in 'username', with: 'New joiner'
    click_on 'Create'

    assert_text 'New joiner'
    assert_current_path "/groups/#{group.id}"
    refute_text 'Pending invitations'
  end

  test 'can join from a group link by logging into an existing account' do
    group = create(:group)
    invitation = create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group)

    account = create(:account, username: 'New joiner', email: 'newjoiner@mycompany.com', password: 'myStr0ngPassword!')

    visit invitation.link(host_and_port)
    fill_in 'password', with: 'myStr0ngPassword!'
    click_on 'Login'

    assert_text 'New joiner'
    assert_current_path "/groups/#{group.id}"
    refute_text 'Pending invitations'
  end

  test 'can join from the groups page by logging into an existing account' do
    group = create(:group)
    create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group)
    create(:account, username: 'New joiner', email: 'newjoiner@mycompany.com', password: 'myStr0ngPassword!')

    visit '/'
    assert_text 'Log in'
    fill_in 'email', with: 'newjoiner@mycompany.com'
    fill_in 'password', with: 'myStr0ngPassword!'
    click_on 'Login'
    assert_text 'My actions'
    click_on 'My groups'
    assert_text 'CREATE A GROUP'

    assert_text group.name
    assert_text 'Invited on'
    accept_confirm do
      click_on 'JOIN'
    end

    assert_text group.name
    assert_text 'Joined on'
    assert_text 'LEAVE'
  end

  test 'can join from a retrospective link by already being logged in' do
    group = create(:group)
    retrospective = create(:retrospective, group: group)
    invitation = create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group, retrospective: retrospective)
    account = create(:account, username: 'New joiner', email: 'newjoiner@mycompany.com')
    as_user(account)

    visit invitation.link(host_and_port)
    binding.pry
    assert_participants_count(2)
    hover_participant('New joiner')
    assert_text 'New joiner'
    assert_logged_in(account.participants.first, with_flags: %i[self])
    assert_current_path "/retrospectives/#{retrospective.id}"
  end

  test 'can join from a retrospective link by creating a new account' do
    group = create(:group)
    retrospective = create(:retrospective, group: group)
    invitation = create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group, retrospective: retrospective)

    visit invitation.link(host_and_port)
    click_on "Don't have an account yet?"
    fill_in 'password', with: 'myStr0ngPassword!'
    fill_in 'username', with: 'New joiner'
    click_on 'Create'

    assert_participants_count(2)
    hover_participant('New joiner')
    assert_text 'New joiner'
    account = Account.find_by(email: 'newjoiner@mycompany.com')
    assert_logged_in(account.participants.first, with_flags: %i[self])
    assert_current_path "/retrospectives/#{retrospective.id}"
  end

  test 'can join from a retrospective link by logging into an existing account' do
    group = create(:group)
    retrospective = create(:retrospective, group: group)
    invitation = create(:pending_invitation, email: 'newjoiner@mycompany.com', group: group, retrospective: retrospective)
    account = create(:account, username: 'New joiner', email: 'newjoiner@mycompany.com', password: 'myStr0ngPassword!')

    visit invitation.link(host_and_port)
    fill_in 'password', with: 'myStr0ngPassword!'
    click_on 'Login'

    assert_participants_count(2)
    hover_participant('New joiner')
    assert_text 'New joiner'
    assert_logged_in(account.participants.first, with_flags: %i[self])
    assert_current_path "/retrospectives/#{retrospective.id}"
  end

  private

  def host_and_port
    "#{Capybara.current_session.server.host}:#{Capybara.current_session.server.port}"
  end
end
