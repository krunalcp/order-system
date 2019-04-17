class AddItemIdIntoOrderItems < ActiveRecord::Migration[5.1]
  def change
    add_column :order_items, :item_id, :integer, index: true
  end
end
