class AddIndexIntoTables < ActiveRecord::Migration[5.1]
  def change
    add_index :items, :name
    add_index :items, :order_no
    add_index :order_items, :item
    add_index :order_items, :order_id
    add_index :orders, :station_id
    add_index :stations, :name
  end
end
