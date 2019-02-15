class UpdateOrderNoInItem < ActiveRecord::Migration[5.1]
  def change
    Item.all.each.with_index(1) do |todo_item, index|
      todo_item.update_column :order_no, index
    end
  end
end
