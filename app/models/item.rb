class Item < ApplicationRecord

  def self.get_summary
    summary =[]

    Item.find_each do |item|
      new_item = {name: item.name, stations: []}
      Station.find_each do |station|
        new_station = {id: station.id, name: station.name}
        quantity = 0
        station.orders.each do |order|
          order.order_items.each do |order_item|
            if order_item.item == item.name
              quantity += order_item.quantity
            end
          end
        end
        new_station[:quantity] = quantity
        new_item[:stations] << new_station
      end
      summary << new_item
    end

    summary
  end
end
