class CreateParticipants < ActiveRecord::Migration[6.0]
  def change
    create_table :participants, id: :uuid do |t|
      t.string :surname, null: false
      t.string :email, null: false
      t.uuid :retrospective_id
      t.timestamps
    end

    add_index :participants, :retrospective_id
  end
end
