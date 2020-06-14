class AddRetrospectiveIdToTopic < ActiveRecord::Migration[6.0]
  def change
    add_column :topics, :retrospective_id, :uuid
    add_index :topics, :retrospective_id
  end
end
