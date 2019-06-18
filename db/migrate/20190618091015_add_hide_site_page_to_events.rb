class AddHideSitePageToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :hide_site_page, :boolean, default: false
  end
end
