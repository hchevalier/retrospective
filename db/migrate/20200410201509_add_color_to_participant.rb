# frozen_string_literal: true

class AddColorToParticipant < ActiveRecord::Migration[6.0]
  def change
    add_column :participants, :color, :string
  end
end
