class RenameEventFavourites < ActiveRecord::Migration[5.1]
  def change
    rename_table :event_favourites, :account_favourites
    add_column :account_favourites, :quantity, :integer
    rename_column :account_favourites, :event_id, :account_id
  end
end
