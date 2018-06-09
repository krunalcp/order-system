class RemoveOrderItemIdFromOrder < ActiveRecord::Migration[5.1]
  def change
    remove_column :orders, :order_item_id, :integer, index: :true
  end
end
