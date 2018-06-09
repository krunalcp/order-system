class AddStationIdToOrder < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :station_id, :integer, index: :true
  end
end
