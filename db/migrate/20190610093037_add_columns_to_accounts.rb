class AddColumnsToAccounts < ActiveRecord::Migration[5.1]
  def change
    add_column :accounts, :number, :string, limit: 20
    add_column :accounts, :address, :string
  end
end
