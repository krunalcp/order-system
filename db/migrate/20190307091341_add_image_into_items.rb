class AddImageIntoItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :image, :string, default: nil
  end
end
