class AddDiscussedReflectionIdToRetrospectives < ActiveRecord::Migration[6.0]
  def change
    add_column :retrospectives, :discussed_reflection_id, :uuid
  end
end
