class AddNextStationIdIntoStations < ActiveRecord::Migration[5.1]
  def change
    add_column :stations, :next_station_id, :integer
    add_index  :stations, :next_station_id
  end
end
