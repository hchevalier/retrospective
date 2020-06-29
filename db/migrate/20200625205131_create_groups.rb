class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups, id: :uuid do |t|
      t.string :name, null: false
      t.datetime :deleted_at
      t.timestamps
    end
  end
end
