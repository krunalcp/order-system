class AddItemImageToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :item_image, :string, default: nil
  end
end
