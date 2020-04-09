class CreateReactions < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      CREATE TYPE reaction_kinds AS ENUM ('vote', 'emoji');
    SQL

    create_table :reactions do |t|
      t.uuid :author_id, null: false
      t.string :target_type, null: false
      t.uuid :target_id, null: false
      t.string :content, null: false
      t.timestamps
    end

    add_column :reactions, :kind, :reaction_kinds, null: false, default: :vote
  end

  def down
    drop_table :reactions
    execute <<-SQL
      DROP TYPE reaction_kinds;
    SQL
  end
end
