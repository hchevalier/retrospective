class AccountMailer < ApplicationMailer
  def send_password_reset(account: nil)
    @account = account || params&.fetch(:account, nil)
    raise unless @account

    mail(to: @account.email, subject: 'Password reset')
  end
end
