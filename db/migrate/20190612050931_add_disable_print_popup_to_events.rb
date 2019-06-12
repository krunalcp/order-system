class AddDisablePrintPopupToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :disable_print_popup, :boolean, default: false
  end
end
