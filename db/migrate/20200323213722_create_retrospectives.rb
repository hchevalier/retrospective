class CreateRetrospectives < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      CREATE TYPE retrospective_kinds AS ENUM (
        'kds', 'kalm', 'daki', 'starfish', 'pmi', 'glad_sad_mad', 'four_l', 'sailboat', 'truths_lie',
        'twitter', 'timeline', 'traffic_lights', 'oscars_gerards', 'star_wars', 'day_z', 'dixit', 'postcard'
      );
    SQL

    execute <<-SQL
      CREATE TYPE retrospective_steps AS ENUM ('gathering', 'thinking', 'grouping', 'voting', 'actions', 'done');
    SQL

    create_table :retrospectives, id: :uuid do |t|
      t.string :name, null: false
      t.bigint :sub_step, default: 0
      t.timestamps
    end

    add_column :retrospectives, :kind, :retrospective_kinds, null: false
    add_column :retrospectives, :step, :retrospective_steps, null: false, default: :gathering
  end

  def down
    drop_table :retrospectives
    execute <<-SQL
      DROP TYPE retrospective_kinds;
      DROP TYPE retrospective_steps;
    SQL
  end
end
