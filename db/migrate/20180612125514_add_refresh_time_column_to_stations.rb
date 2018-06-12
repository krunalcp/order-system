class AddRefreshTimeColumnToStations < ActiveRecord::Migration[5.1]
  def change
    add_column :stations, :refresh_time, :integer, default: '60'
  end
end
