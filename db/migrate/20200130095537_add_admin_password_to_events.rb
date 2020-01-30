class AddAdminPasswordToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :admin_password, :string
  end
end
