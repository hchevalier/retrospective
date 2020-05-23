class AccountMailer < ApplicationMailer
  def send_password_reset(account)
    @account = account
    mail(to: @account.email, subject: 'Password reset')
  end
end
