class UpdateEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :published_name, :string
    # change_column :events, :tokens, :string, limit: 500
  end
end
