class AddSeparateByCategoryToStations < ActiveRecord::Migration[5.1]
  def change
    add_column :stations, :separate_by_category, :boolean, default: false
  end
end
