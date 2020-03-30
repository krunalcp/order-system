class AddItemImageSizeToSites < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :item_image_width, :string
    add_column :events, :item_image_height, :string
  end
end
