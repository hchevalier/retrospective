# frozen_string_literal: true

module CookiesHelpers
  def as_user(account)
    ApplicationController
      .any_instance.expects(:current_account)
      .at_least_once
      .returns(account)
  end

  def logged_in_as(participant)
    ActionDispatch::Cookies::SignedKeyRotatingCookieJar
      .any_instance.expects(:[])
      .with(:participant_id)
      .at_least_once
      .returns(participant.id)

    ApplicationController
      .any_instance
      .expects(:current_account)
      .at_least_once
      .returns(participant.account)
  end

  def logged_out
    ActionDispatch::Cookies::SignedKeyRotatingCookieJar
      .any_instance
      .unstub(:[])

    ApplicationController
      .any_instance
      .unstub(:current_account)
  end
end
