class AddEventHelpUrlToEvent < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :event_help_url, :string
  end
end
