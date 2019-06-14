class AddShowStationListToSites < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :show_station_list, :boolean, default: false
  end
end
