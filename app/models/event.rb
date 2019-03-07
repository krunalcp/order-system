# frozen_string_literal: true

class Event < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User
  devise authentication_keys: [:name, :email]

  has_many :orders
  has_many :order_items, through: :orders
  has_many :items
  has_many :stations
  has_many :accounts
  has_many :categories
  belongs_to :station, optional: true

  validates :published_name, presence: true
  validates :name, presence: true, uniqueness: true
  validates :email, presence: true

  before_validation :set_email

  private
    def set_email
      return if email.present?

      self.email = name
    end
end
