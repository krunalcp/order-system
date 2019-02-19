class AddEventId < ActiveRecord::Migration[5.1]
  def change
    add_column :stations, :event_id, :integer, index: true
    add_column :items, :event_id, :integer, index: true
    add_column :orders, :event_id, :integer, index: true
  end
end
