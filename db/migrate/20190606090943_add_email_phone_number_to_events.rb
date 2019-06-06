class AddEmailPhoneNumberToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :printouts_email, :string
    add_column :events, :phone_number, :string
  end
end
