class AddRequirePasswordForCustomerOrderToSite < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :require_password_for_customer_order, :boolean, default: false
  end
end
