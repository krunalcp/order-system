class CreateCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :categories do |t|
      t.string :name
      t.integer :show_order
      t.timestamps
    end
    add_index :categories, :show_order
  end
end
