class AddOrderNoIntoItemsTable < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :order_no, :integer
  end
end
