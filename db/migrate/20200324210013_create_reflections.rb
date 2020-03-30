class CreateReflections < ActiveRecord::Migration[6.0]
  def change
    create_table :reflections, id: :uuid do |t|
      t.references :zone
      t.uuid :owner_id, null: false
      t.bigint :topic_id, null: true, default: nil
      t.integer :position_in_zone, null: false, default: 1
      t.integer :position_in_topic, null: false, default: 1
      t.text :content, null: false, blank: false
    end
  end
end
