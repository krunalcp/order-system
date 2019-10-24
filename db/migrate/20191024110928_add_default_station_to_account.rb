class AddDefaultStationToAccount < ActiveRecord::Migration[5.1]
  def change
    add_column :accounts, :station_id, :integer
  end
end
