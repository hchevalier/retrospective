class CreateRetrospectives < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      CREATE TYPE retrospective_kinds AS ENUM (
        'kds', 'kalm', 'daki', 'starfish', 'pmi', 'glad_sad_mad', 'four_l', 'sailboat', 'truths_lie',
        'twitter', 'timeline', 'traffic_lights', 'oscars_gerards', 'star_wars', 'day_z', 'dixit', 'postcard'
      );
    SQL

    create_table :retrospectives, id: :uuid do |t|
      t.string :name, null: false
      t.timestamps
    end

    add_column :retrospectives, :kind, :retrospective_kinds, null: false
  end

  def down
    drop_table :retrospectives
    execute <<-SQL
      DROP TYPE retrospective_kinds;
    SQL
  end
end
