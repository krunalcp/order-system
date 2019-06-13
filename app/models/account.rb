class Account < ApplicationRecord
  has_secure_password
  has_many :orders

  has_many :order_items, through: :orders
  has_many :account_favourites
  belongs_to :event

  validates :email, uniqueness: { scope: :event_id }, allow_blank: true
  validates :password,
            length: { minimum: 6 },
            if: -> { new_record? || !password.nil? }
end
