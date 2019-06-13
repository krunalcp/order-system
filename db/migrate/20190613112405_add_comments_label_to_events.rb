class AddCommentsLabelToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :comments_label, :string
  end
end
