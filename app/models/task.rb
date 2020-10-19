class Task < ApplicationRecord
  belongs_to :reflection
  belongs_to :author, class_name: 'Participant', inverse_of: :created_tasks
  belongs_to :assignee, class_name: 'Account', inverse_of: :assigned_tasks, primary_key: :public_id
  has_one :retrospective, through: :reflection
  has_many :reactions, as: :target, inverse_of: :target

  scope :pending, -> { where(status: %i(todo on_hold)) }

  enum status: {
    done: 'done',
    on_hold: 'on_hold',
    todo: 'todo',
    wont_do: 'wont_do'
  }

    def description
      anonymize(super)
    end

  def pending?
    todo? || on_hold?
  end

  def as_json
    {
      id: id,
      reflection: { id: reflection.id, content: reflection.content, zone: { name: reflection.zone.identifier} },
      retrospective: { zonesTypology: retrospective.zones_typology },
      author: author.minimal_profile,
      assignee: assignee&.as_public_json,
      description: description,
      status: status,
      createdAt: created_at
    }
  end
end
