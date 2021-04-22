# frozen_string_literal: true

class AddRetrospectiveRelatedDataToParticipants < ActiveRecord::Migration[6.1]
  def change
    add_column :participants, :retrospective_related_data, :jsonb, default: {}
  end
end
