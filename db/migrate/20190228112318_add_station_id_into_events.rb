class AddStationIdIntoEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :station_id, :integer
  end
end
