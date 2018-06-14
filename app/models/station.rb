class Station < ApplicationRecord

  has_many :orders

  def next
    Station.find_by_id(next_station_id)
  end

  def prev
    Station.where("id < ?", id).last
  end
end
