class AddChargeToAccountColumnToOrders < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :charge_to_account, :boolean, default: false
  end
end
