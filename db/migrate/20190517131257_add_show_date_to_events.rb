class AddShowDateToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :show_date, :boolean
  end
end
