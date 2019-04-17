class RemoveItemFromOrderItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :order_items, :item
  end
end
