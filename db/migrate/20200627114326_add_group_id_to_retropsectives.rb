class AddGroupIdToRetropsectives < ActiveRecord::Migration[6.0]
  def up
    add_column :retrospectives, :group_id, :uuid, null: true
    Retrospective.reset_column_information
    Retrospective.includes(:participants).where(group_id: nil).each do |retrospective|
      group = Group.find_or_create_by(name: retrospective.name)
      retrospective.participants.pluck(:account_id).uniq.each do |account_id|
        group.group_accesses.find_or_create_by(account_id: account_id)
      end
      retrospective.update!(group: group)
    end
    change_column_null :retrospectives, :group_id, false
  end

  def down
    remove_column :retrospectives, :group_id
  end
end
