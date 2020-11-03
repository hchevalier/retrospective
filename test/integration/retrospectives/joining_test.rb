# frozen_string_literal: true

require 'test_helper'

class Retrospective::JoiningTest < ActionDispatch::IntegrationTest
  test 'creates a new retrospective with an existing group' do
    account = create(:account)
    group = create(:group, name: 'MyGroupName')
    group.add_member(account)
    other_group = create(:group, name: 'MyOtherGroup')
    other_group.add_member(account)
    as_user(account)

    visit '/'
    assert_text 'My actions'
    click_on 'START'

    find('input[name="group_name"]').click
    assert_text 'MyGroupName'
    assert_text 'MyOtherGroup'
    find('[name="group_name_dropdown"] div', text: 'MyGroupName', match: :first).click
    assert_field 'group_name', with: 'MyGroupName'
    refute_text 'MyOtherGroup'
    find('input[name="group_name"]').click
    fill_in 'group_name', with: 'MyOther'
    refute_text 'MyGroupName'
    assert_text 'MyOtherGroup'
    assert_text 'Create group "MyOther"'
    fill_in 'group_name', with: 'MyOtherGroup'
    refute_text 'Create group "MyOther"'

    select 'Glad Sad Mad', from: 'retrospective_kind'
    assert_field 'group_name', with: 'MyGroupName'
    refute_text 'MyOtherGroup'

    click_on 'START RETROSPECTIVE'

    assert_text 'Lobby MyGroupName'
  end

  test 'creates a new retrospective with a new group' do
    account = create(:account)
    as_user(account)

    visit '/'
    assert_text 'My actions'
    click_on 'START'

    find('input[name="group_name"]').click
    refute_text 'MyGroupName'
    fill_in 'group_name', with: 'MyGroupName'
    find('[name="group_name_dropdown"] div', text: 'Create group "MyGroupName"', match: :first).click
    select 'Glad Sad Mad', from: 'retrospective_kind'
    click_on 'START RETROSPECTIVE'

    assert_text 'Lobby MyGroupName'
    account.reload
    visit '/'
    assert_text 'Glad Sad Mad with MyGroupName'
  end

  test 'joins an existing retrospective by creating an account' do
    retrospective = create(:retrospective)
    invitation = create_invitation(retrospective, 'other_one@yopmail.com')

    visit single_page_app_path(path: "retrospectives/#{retrospective.id}", invitation_id: invitation.id)
    refute_text 'Lobby'
    assert_text 'Log in'

    click_on "Don't have an account yet?"
    fill_in 'username', with: 'Other one'
    fill_in 'email', with: 'other_one@yopmail.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Create account'

    assert_text 'Lobby'
    assert_participants_count(2)
    hover_participant('Other one')
    assert_text 'Other one'
  end

  test 'cannot create an account when domain whitelisting is on and email is not authorized' do
    ApplicationController.stub_const(:AUTHORIZED_DOMAINS, ['@mycompany.com']) do
      retrospective = create(:retrospective)
      invitation = create_invitation(retrospective, 'other_one@yopmail.com')

      visit single_page_app_path(path: "retrospectives/#{retrospective.id}", invitation_id: invitation.id)
      refute_text 'Lobby'
      assert_text 'Log in'

      click_on "Don't have an account yet?"
      fill_in 'username', with: 'Other one'
      fill_in 'email', with: 'other_one@yopmail.com'
      fill_in 'password', with: 'mypassword'

      dismiss_confirm do
        click_on 'Create account'
      end
    end
  end

  test 'joins an existing retrospective by logging in to an existing account' do
    retrospective = create(:retrospective)
    create(:account, username: 'Other one', email: 'other_one@yopmail.com', password: 'mypasword')
    invitation = create_invitation(retrospective, 'other_one@yopmail.com')

    visit single_page_app_path(path: "retrospectives/#{retrospective.id}", invitation_id: invitation.id)
    refute_text 'Lobby'
    assert_text 'Log in'

    fill_in 'email', with: 'other_one@yopmail.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Login'

    assert_text 'Lobby'
    assert_participants_count(2)
    hover_participant('Other one')
    assert_text 'Other one'
  end

  test 'joining an existing retrospective and logging in reuses a participant if any' do
    retrospective = create(:retrospective)
    account = create(:account, username: 'Other one', email: 'other_one@yopmail.com', password: 'mypassword')
    participant = create(:participant, retrospective: retrospective, account: account, surname: 'Other one')
    invitation = create_invitation(retrospective, 'other_one@yopmail.com')

    assert_no_difference 'Participant.count' do
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      refute_text 'Lobby'
      assert_text 'Log in'
      fill_in 'email', with: 'other_one@yopmail.com'
      fill_in 'password', with: 'mypassword'
      click_on 'Login'
      assert_logged_in(participant, with_flags: %i[self])
    end
  end

  test 'joining an existing retrospective while being logged with an existing account creates a participant' do
    retrospective = create(:retrospective)
    account = create(:account)
    as_user(account)
    invitation = create_invitation(retrospective, account.email)

    assert_difference 'Participant.count' do
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}", invitation_id: invitation.id)
      assert_text 'Lobby'
      refute_field 'email'
      refute_button 'Login'
    end

    assert account, Participant.last.account
  end

  test 'joining an existing retrospective while being logged with an existing account reuses a participant if any' do
    retrospective = create(:retrospective)
    account = create(:account, username: 'Other one')
    participant = create(:participant, retrospective: retrospective, account: account, surname: 'Other one')
    as_user(account)

    assert_no_difference 'Participant.count' do
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(participant, with_flags: %i[self])
      refute_field 'email'
      refute_button 'Login'
    end
  end

  test 'can join a retrospective without loging in again' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_logged_as_facilitator
    refute_button 'Login'
  end

  test 'cannot join a retrospective when it is done if logged out' do
    retrospective = create(:retrospective, step: :done)

    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_text 'Log in'
    refute_text 'Lobby'
  end

  test 'cannot join a retrospective when it is done if logged in but not in participants list' do
    retrospective = create(:retrospective, step: :done, created_at: 2.hours.ago)
    other_retrospective = create(:retrospective)
    retrospective.group.add_member(other_retrospective.facilitator.account)
    ApplicationController
      .any_instance
      .expects(:current_account)
      .at_least_once
      .returns(other_retrospective.facilitator.account)

    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_text 'My actions'
  end

  test 'only facilitator can see the button to start the retrospective' do
    retrospective = create(:retrospective)
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
    assert_logged_as_facilitator
    assert_button 'Next'

    logged_in_as(other_participant)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
    refute_logged_as_facilitator
    refute_button 'Next'
  end

  test 'sees new participant joining' do
    retrospective = create(:retrospective)
    invitation = create_invitation(retrospective, 'other_one@yopmail.com')

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_logged_as_facilitator
    assert_participants_count(1)
    hover_participant('Other one')
    refute_text 'Other one'

    within_window(open_new_window) do
      logged_out
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}", invitation_id: invitation.id)
      click_on "Don't have an account yet?"
      fill_in 'username', with: 'Other one'
      fill_in 'email', with: 'other_one@yopmail.com'
      fill_in 'password', with: 'mypassword'
      click_on 'Create account'
      assert_participants_count(2)
      hover_participant('Other one')
      assert_text 'Other one'
    end

    assert_participants_count(2)
    hover_participant('Other one')
    assert_text 'Other one'
  end

  private

  def create_invitation(retrospective, email)
    create(:pending_invitation, account: retrospective.facilitator.account, email: email, group: retrospective.group)
  end
end
