class Account < ApplicationRecord
  has_secure_password validations: false
  has_many :orders

  has_many :order_items, through: :orders
  has_many :account_favourites
  belongs_to :event
  belongs_to :station, optional: true

  validates :email, uniqueness: { scope: :event_id }, allow_blank: true
end
