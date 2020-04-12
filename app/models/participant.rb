class Participant < ApplicationRecord
  belongs_to :retrospective, optional: true
  has_one :organized_retrospective, class_name: 'Retrospective', foreign_key: :organizer_id, inverse_of: :organizer
  has_one :revealing_retrospective, class_name: 'Retrospective', foreign_key: :revealer_id, inverse_of: :revealer
  has_many :reflections, foreign_key: :owner_id, inverse_of: :owner
  has_many :reactions, foreign_key: :author_id, inverse_of: :author

  before_create :set_default_color

  validates :retrospective, presence: true, unless: -> { new_record? && organized_retrospective }
  validate :valid_color?, if: -> { color_changed? }, on: :update

  scope :logged_in, -> { where(logged_in: true) }

  COLORS = {
    jaipur: { apple: '#aed143', yellow: '#fbd249', orange: '#f49f3f', pink: '#d35595', turquoise: '#51bcb3' }.freeze,
    helsinki: { pink: '#f6c2d9', yellow: '#fff69b', green: '#bcdfc9', blue: '#a1c8e9', lila: '#e4dae2' }.freeze,
    marseille: { green: '#b7ddc8', turquoise: '#69c7b5', yellow: '#fff49c', pink: '#f4c4d6', blue: '#9fc7e4' }.freeze,
    cape_town: { salmon: '#f0787e', orange: '#f5a841', blue: '#5ac5bc', pink: '#ee65a3', yellow: '#f5e34b' }.freeze,
    new_york: { orange: '#f9ca47', blue: '#88b3e0', sky: '#a6cdee', grey: '#cacabf', yellow: '#fbd253' }.freeze,
    bali: { lila: '#e1d9e4', orange: '#f5ae93', blue: '#9ecef0', pink: '#f1c7db', green: '#b7e1ce' }.freeze,
    bora_bora: { green: '#75be6f', apple: '#b6d051', turquoise: '#bcddc7', sky: '#a7cbeb', blue: '#86b8e6' }.freeze,
    marrakesh: { red: '#ee5f35', orange: '#f8bd49', yellow: '#e7df34', blue: '#86a6d5', purple: '#a2509a' }.freeze,
    miami: { turquoise: '#73cac4', yellow: '#e3e546', salmon: '#f2788f', pink: '#f69dbb', orange: '#fbad4b' }.freeze,
    rio_de_janeiro: { orange: '#f39a4f', pink: '#eb6092', blue: '#4ab6d9', green: '#abcc51', yellow: '#f9c847' }.freeze
  }.freeze

  ALL_COLORS = COLORS.values.flat_map(&:values)

  def profile
    {
      uuid: id,
      surname: surname,
      color: color,
      status: logged_in,
      organizer: organizer?,
      revealer: revealer?
    }
  end

  def organizer?
    association(:retrospective).loaded? ? retrospective.organizer_id == self.id : organized_retrospective.present?
  end

  def revealer?
    association(:retrospective).loaded? ? retrospective.revealer_id == self.id : revealing_retrospective.present?
  end

  def original_organizer?
    retrospective.participants.order(:created_at).first == self
  end

  def join
    Rails.logger.debug "Broacasting that #{surname} (#{id}) joined"
    OrchestratorChannel.broadcast_to(retrospective, action: 'newParticipant', parameters: { profile: profile })
  end

  private

  def set_default_color
    self.color = color || (retrospective || organized_retrospective).available_colors.sample
  end

  def valid_color?
    ALL_COLORS.include?(color)
  end
end
