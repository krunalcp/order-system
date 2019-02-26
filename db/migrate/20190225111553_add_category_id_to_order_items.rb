class AddCategoryIdToOrderItems < ActiveRecord::Migration[5.1]
  def change
    add_column :order_items, :category_id, :integer, index: true
  end
end
