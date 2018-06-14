class AddNotesIntoOrderItems < ActiveRecord::Migration[5.1]
  def change
    add_column :order_items, :notes, :string, limit: 500
  end
end
