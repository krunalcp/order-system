class OrderItem < ApplicationRecord
	belongs_to :order
  belongs_to :item
  belongs_to :category, optional: true
end
