class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.string :customer_name
      t.string :status
      t.decimal :value, precision: 8, scale: 2

      t.timestamps
    end
  end
end
