class AddBannerMessageToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :banner_message, :string
  end
end
