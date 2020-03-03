class AddHideHelpToSite < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :hide_help_url, :boolean, default: false
    add_column :events, :hide_event_help_url, :boolean, default: false
  end
end
