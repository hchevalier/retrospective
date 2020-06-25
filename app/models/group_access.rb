class GroupAccess < ApplicationRecord
  belongs_to :account
  belongs_to :group
end
