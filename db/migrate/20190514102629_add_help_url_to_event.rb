class AddHelpUrlToEvent < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :help_url, :string
  end
end
