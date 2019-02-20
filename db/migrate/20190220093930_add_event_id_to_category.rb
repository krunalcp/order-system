class AddEventIdToCategory < ActiveRecord::Migration[5.1]
  def change
    add_column :categories, :event_id, :integer, index: true
  end
end
