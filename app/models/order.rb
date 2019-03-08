class Order < ApplicationRecord
  has_many :order_items
  belongs_to :event
  belongs_to :station, optional: true
  belongs_to :account, optional: true
end
