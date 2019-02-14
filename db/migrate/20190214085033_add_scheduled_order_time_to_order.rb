class AddScheduledOrderTimeToOrder < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :scheduled_order_time, :datetime
  end
end
