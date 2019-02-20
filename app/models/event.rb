# frozen_string_literal: true

class Event < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User
  devise authentication_keys: [:name, :email]

  has_many :orders
  has_many :items
  has_many :stations
  has_many :accounts

end
