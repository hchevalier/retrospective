# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/account_mailer
class AccountMailerPreview < ActionMailer::Preview
  def send_password_reset
    account = Account.first
    account.password_reset_token = 'dummy_token'
    AccountMailer.with(account: account).send_password_reset
  end
end
