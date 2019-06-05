class AddPrintedImageToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :printed_image, :string
  end
end
