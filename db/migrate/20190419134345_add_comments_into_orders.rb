class AddCommentsIntoOrders < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :comments, :text
  end
end
