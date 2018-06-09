class Station < ApplicationRecord

  has_many :orders

  def next
    Station.where("id > ?", id).first
  end

  def prev
    Station.where("id < ?", id).last
  end
end
