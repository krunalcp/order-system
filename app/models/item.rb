class Item < ApplicationRecord
  belongs_to :category

  validates :name, presence: true, uniqueness: true

  attr_accessor :notes

  default_scope { order(:order_no) }

  acts_as_list column: :order_no

  def self.get_summary(type = 'quantity')
    summary = []

    Item.find_each do |item|
      summary << { name: item.name, stations: [] }
    end
    stations = {}
    Station.find_each do |station|
      stations["S#{station.id} - #{station.name}"] = { quantity: 0 }
      order_items = station.order_items.select("order_items.item, sum(order_items.#{type}) as quantity").group('order_items.item')
      if order_items.present?
        summary.each do |s|
          match = false
          order_items.each do |order_item|
            next unless s[:name] == order_item.item

            s[:stations] << { name: "S#{station.id} - #{station.name}", quantity: order_item.quantity }
            match = true
            break
          end
          next if match

          s[:stations] << { name: "S#{station.id} - #{station.name}", quantity: 0 }
        end
      else
        summary.each do |s|
          s[:stations] << { name: "S#{station.id} - #{station.name}", quantity: 0 }
        end
      end
    end

    total = { name: 'Station Total', stations: [] }
    # Process Row and Column Total
    main_total = 0
    summary.each do |s|
      row_total = 0

      s[:stations].each do |station|
        stations[station[:name]][:quantity] += station[:quantity]
        row_total += station[:quantity]
        main_total += station[:quantity]
        station[:quantity] = "$#{station[:quantity]}" if type == 'value'
      end

      s[:stations] << { name: 'Item Total', quantity: (type == 'value' ? "$#{row_total}" : row_total) }
    end

    stations.each do |name, value|
      total[:stations] << { name: name, quantity: (type == 'value' ? "$#{value[:quantity]}" : value[:quantity]) }
    end
    total[:stations] << { name: 'Station Total', quantity: (type == 'value' ? "$#{main_total}" : main_total) }

    summary << total
    summary
  end
end
