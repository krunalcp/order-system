class CreateEventFavourites < ActiveRecord::Migration[5.1]
  def change
    create_table :event_favourites do |t|
      t.integer :event_id
      t.integer :item_id
      t.timestamps
    end
    add_index :event_favourites, :event_id
    add_index :event_favourites, :item_id
  end
end
