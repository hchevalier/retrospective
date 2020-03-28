class CreateReactions < ActiveRecord::Migration[6.0]
  def change
    create_table :reactions do |t|
      t.uuid :author_id, null: false
      t.string :target_type, null: false
      t.bigint :target_id, null: false
      t.string :kind, null: false, default: :vote
      t.string :content, null: false
    end
  end
end
