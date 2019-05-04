class AddOrderNumberToOrder < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :order_number, :integer
    add_index :orders, :order_number
  end
end
