class AddSpecialPriceToItem < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :special_price, :decimal, precision: 8, scale: 2
  end
end
