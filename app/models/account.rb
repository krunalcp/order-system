class Account < ApplicationRecord
  has_secure_password
  has_many :orders

  has_many :order_items, through: :orders

  belongs_to :event

  validates :email, presence: true, uniqueness: true
  validates :password,
            length: { minimum: 6 },
            if: -> { new_record? || !password.nil? }
end
