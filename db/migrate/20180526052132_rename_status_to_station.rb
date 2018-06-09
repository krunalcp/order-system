class RenameStatusToStation < ActiveRecord::Migration[5.1]
  def change
    rename_column :orders, :status, :station
  end
end
