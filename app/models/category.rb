class Category < ApplicationRecord
  has_many :items
  has_many :order_items
  belongs_to :event

  validates :name, :show_order, presence: true

  acts_as_list column: :show_order

  default_scope { order(:show_order) }
end
