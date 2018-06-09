class CreateOrderItems < ActiveRecord::Migration[5.1]
  def change
    create_table :order_items do |t|
      t.string :item
      t.integer :quantity
      t.decimal :value, precision: 8, scale: 2

      t.timestamps
    end
  end
end
