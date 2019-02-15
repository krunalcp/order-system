class AddCategoryIdToItem < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :category_id, :integer, index: :true
  end
end
