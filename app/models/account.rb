class Account < ApplicationRecord
  has_many :participants
  has_many :retrospectives, through: :participants

  has_secure_password

  validates :email, uniqueness: true

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_initialize do |account|
      account.username = auth.info.name
      account.email = auth.info.email
      account.password = account.password_confirmation = SecureRandom.hex
    end
  end
end
