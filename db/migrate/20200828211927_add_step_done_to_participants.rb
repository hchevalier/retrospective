# frozen_string_literal: true

class AddStepDoneToParticipants < ActiveRecord::Migration[6.0]
  def change
    add_column :participants, :step_done, :boolean, null: false, default: false
  end
end
