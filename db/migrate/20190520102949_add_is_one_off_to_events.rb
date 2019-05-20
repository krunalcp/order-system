class AddIsOneOffToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :is_one_off, :boolean
  end
end
