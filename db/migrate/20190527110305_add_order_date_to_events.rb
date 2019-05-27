class AddOrderDateToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :earliest_preorder_date, :date
    add_column :events, :latest_preorder_date, :date
  end
end
