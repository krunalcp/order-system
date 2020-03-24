class AddSystemCodeToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :system_code, :string
  end
end
