class Item < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  attr_accessor :notes

  default_scope { order(:order_no) }

  def self.get_summary(type = "quantity")
    summary =[]

    Item.find_each do |item|
      summary << {name: item.name, stations: []}
    end
    Station.find_each do |station|
      order_items = station.order_items.select("order_items.item, sum(order_items.#{type}) as quantity").group("order_items.item")
      if order_items.present?
        summary.each do |s|
          match = false
          order_items.each do |order_item|
            if s[:name] == order_item.item
              s[:stations] << { id: station.id, name: station.name, quantity: order_item.quantity }
              match = true
              break
            end
          end
          unless match
            s[:stations] << { id: station.id, name: station.name, quantity: 0 }
          end
        end
      else
        summary.each do |s|
          s[:stations] << { id: station.id, name: station.name, quantity: 0 }
        end
      end
    end

    summary
  end
end
