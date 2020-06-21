class ChangeTopicIdFromReflectionsToUuid < ActiveRecord::Migration[6.0]
  def up
    remove_column :reflections, :topic_id
    add_column :reflections, :topic_id, :uuid
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "Reflection#topic_id cannot be changed to bigint again"
  end
end
