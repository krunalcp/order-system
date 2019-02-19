class Order < ApplicationRecord
  belongs_to :event
	has_many :order_items
  belongs_to :station
end
