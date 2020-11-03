# frozen_string_literal: true

class RemoveEmailFromParticipants < ActiveRecord::Migration[6.0]
  def up
    remove_column :participants, :email
  end

  def down
    add_column :participants, :email, :string
    clear_cache!
    Participant.all.update_all(email: 'noone@retrospective.dummy')
    change_column_null :participants, :email, false
  end
end
