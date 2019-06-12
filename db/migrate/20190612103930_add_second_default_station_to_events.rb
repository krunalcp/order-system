class AddSecondDefaultStationToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :second_station_id, :integer
  end
end
