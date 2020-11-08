# frozen_string_literal: true

class AddRevealedToReflections < ActiveRecord::Migration[6.0]
  def change
    add_column :reflections, :revealed, :boolean, null: false, default: false
  end
end
