class AddNextRetrospectiveToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :next_retrospective, :timestamp
  end
end
