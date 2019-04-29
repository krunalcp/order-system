class Item < ApplicationRecord
  belongs_to :event
  belongs_to :category
  has_many :order_items
  has_many :account_favourites

  validates :name, presence: true, uniqueness: { scope: :event_id }

  attr_accessor :notes, :favourite_quantity

  default_scope { order(:order_no) }

  acts_as_list column: :order_no

  def self.get_summary(current_event, type = 'quantity')
    summary = []

    current_event.items.where(active: true).find_each do |item|
      summary << { id: item.id, name: item.name, stations: [] }
    end
    stations = {}
    current_event.stations.each_with_index do |station, index|
      stations[station.name] = { quantity: 0 }
      order_items = if type == 'value'
        station.order_items.select(
          "order_items.item_id, sum(order_items.#{type} * order_items.quantity) as quantity"
        ).group('order_items.item_id')
      else
        station.order_items.select(
          "order_items.item_id, sum(order_items.#{type}) as quantity"
        ).group('order_items.item_id')
      end
      if order_items.present?
        summary.each do |s|
          match = false
          order_items.each do |order_item|
            next unless s[:id] == order_item.item_id

            s[:stations] << {
              name: station.name,
              quantity: order_item.quantity
            }
            match = true
            break
          end
          next if match

          s[:stations] << { name: station.name, quantity: 0 }
        end
      else
        summary.each do |s|
          s[:stations] << { name: station.name, quantity: 0 }
        end
      end
    end

    total = { name: 'Total', stations: [] }
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

      s[:stations] << { name: 'Total', quantity: (type == 'value' ? "$#{row_total}" : row_total) }
    end

    stations.each do |name, value|
      total[:stations] << { name: name, quantity: (type == 'value' ? "$#{value[:quantity]}" : value[:quantity]) }
    end
    total[:stations] << { name: 'Total', quantity: (type == 'value' ? "$#{main_total}" : main_total) }

    summary << total
    summary
  end

  def self.import_items(current_event, items)
    response = []
    items.each_with_index do |item, index|
      category = current_event.categories.find_by_name(item['Category'])
      item_hash = {
        name: item['Name'],
        price: item['Price'],
        special_price: itme['SpecialPrice'],
        order_no: item['Order'],
        active: item['Active'],
        image: item['Image'],
        category: category
      }
      new_item = current_event.items.new(item_hash)
      item_hash.merge!(category_name: item['Category'], row: index + 1)
      if new_item.save
        response << item_hash.merge!({success: true})
      else
        response << item_hash.merge!({success: false, error: new_item.errors.full_messages.join(', ')})
      end
    end
    response
  end
end
