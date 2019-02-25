class AddAccountIdToOrders < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :account_id, :integer, index: true
  end
end
