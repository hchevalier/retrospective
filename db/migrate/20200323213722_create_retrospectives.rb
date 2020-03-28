class CreateRetrospectives < ActiveRecord::Migration[6.0]
  def change
    create_table :retrospectives, id: :uuid do |t|
      t.string :kind, null: false
      t.string :name, null: false
      t.timestamps
    end
  end
end
