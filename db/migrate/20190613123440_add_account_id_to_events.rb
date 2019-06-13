class AddAccountIdToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :account_id, :integer
  end
end
