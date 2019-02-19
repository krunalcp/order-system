class CreateAccounts < ActiveRecord::Migration[5.1]
  def change
    create_table :accounts do |t|
      t.integer :event_id
      t.string :name
      t.string :contact_name
      t.string :phone
      t.string :email
      t.timestamps
    end
    add_index :accounts, :event_id
  end
end
