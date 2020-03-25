class Item < ApplicationRecord
  belongs_to :event
  belongs_to :category
  has_many :order_items
  has_many :account_favourites

  validates :name, presence: true, uniqueness: { scope: :event_id }

  attr_accessor :notes, :favourite_quantity

  default_scope { order(:order_no) }

  acts_as_list column: :order_no, scope: %i[event_id category_id]

  def self.get_summary(current_event, type = 'quantity', period = 'all')
    summary = []

    current_event.items.where(active: true).find_each do |item|
      summary << { id: item.id, name: item.name, stations: [] }
    end
    stations = {}
    current_event.stations.order('created_at').each_with_index do |station, index|
      stations[station.name] = { quantity: 0 }

      select = if type == 'value'
        "order_items.item_id, sum(order_items.#{type} * order_items.quantity) as quantity"
      else
        "order_items.item_id, sum(order_items.#{type}) as quantity"
      end

      condition = if period == 'current'
        [
          "((orders.scheduled_order_time >= ? and orders.scheduled_order_time <= ?) or (orders.created_at >= ? and orders.created_at <= ?)) and orders.station_id = ?",
          Time.now.beginning_of_month, Time.now.end_of_month,
          Time.now.beginning_of_month, Time.now.end_of_month, station.id
        ]
      elsif period == 'last'
        [
          "((orders.scheduled_order_time >= ? and orders.scheduled_order_time <= ?) or (orders.created_at >= ? and orders.created_at <= ?)) and orders.station_id = ?",
          DateTime.now.prev_month.beginning_of_month, DateTime.now.prev_month.end_of_month,
          DateTime.now.prev_month.beginning_of_month, DateTime.now.prev_month.end_of_month, station.id
        ]
      else
        ["orders.station_id = ?", station.id]
      end

      ots = OrderItem.joins(
        "INNER JOIN orders ON order_items.order_id = orders.id"
      ).select(select).group('order_items.item_id').where(condition)

      if ots.present?
        summary.each do |s|
          match = false
          ots.each do |order_item|
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
        special_price: item['SpecialPrice'],
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

  def self.before_import_items_price(current_event, items)
    response = []
    items.each_with_index do |new_item, index|
      item_hash = {
        new_price: new_item['Price'],
        new_special_price: new_item['SpecialPrice'],
        system_code: new_item['ItemCode'],
        new_active: new_item['Active']
      }
      item = current_event.items.find_by_system_code(new_item['ItemCode'])
      if item.present?
        response << item_hash.merge!({price: item.price, special_price: item.special_price, active: item.active})
      else
        response << item_hash.merge!({price: '', special_price: '', active: '', error: 'Item not Found'})
      end
    end
    response
  end

  def self.import_items_price(current_event, items)
    response = []
    items.each_with_index do |new_item, index|
      item_hash = {
        new_price: new_item['new_price'],
        new_special_price: new_item['new_special_price'],
        system_code: new_item['system_code'],
        new_active: new_item['new_active']
      }
      item = current_event.items.find_by_system_code(new_item['system_code'])
      if item.present? && item.system_code.present?
        item.price =  new_item['new_price']
        item.special_price = new_item['new_special_price']
        item.active = new_item['new_active']
        if item.save
          response << item_hash.merge!({price: item.price_was, special_price: item.special_price_was, active: item.active_was, success: true})
        else
          response << item_hash.merge!({price: item.price, special_price: item.special_price, active: item.active_was, error: item.errors.full_messages.join(', '), success: false})
        end
      else
        response << item_hash.merge!({price: '', special_price: '', active: '', error: 'Item not Found'}, success: false)
      end
    end
    response
  end
end
