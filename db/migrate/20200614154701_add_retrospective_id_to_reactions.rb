class AddRetrospectiveIdToReactions < ActiveRecord::Migration[6.0]
  def up
    add_column :reactions, :retrospective_id, :uuid, null: true
    clear_cache!
    Reaction.where(retrospective_id: nil).each do |reaction|
      reaction.update_column(:retrospective_id, reaction.author.retrospective_id)
    end
    change_column_null :reactions, :retrospective_id, false
  end

  def down
    remove_column :reactions, :retrospective_id
  end
end
