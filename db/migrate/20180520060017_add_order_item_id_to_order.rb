class AddOrderItemIdToOrder < ActiveRecord::Migration[5.1]
  def change
  	add_column :orders, :order_item_id, :integer, index: :true
  end
end
