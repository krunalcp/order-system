class AddDisablePrintPopupCustomerToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :disable_print_popup_customer, :boolean, default: false
  end
end
