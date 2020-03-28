class Participant < ApplicationRecord
  belongs_to :retrospective
  has_many :reactions, inverse_of: :author
end
