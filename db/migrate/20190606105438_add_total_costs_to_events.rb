class AddTotalCostsToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :total_costs, :decimal, precision: 8, scale: 2
  end
end
