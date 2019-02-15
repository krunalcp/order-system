class Category < ApplicationRecord
  has_many :items
  validates :name, :show_order, presence: true

  acts_as_list column: :show_order

  default_scope { order(:show_order) }
end
