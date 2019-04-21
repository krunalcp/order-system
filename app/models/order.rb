class Order < ApplicationRecord
  has_many :order_items, dependent: :delete_all
  has_many :items, through: :order_items
  belongs_to :event
  belongs_to :station, optional: true
  belongs_to :account, optional: true

  def self.import_orders(current_event, orders)
    validate = validate_dependent(current_event, orders)
    return validate if validate.is_a?(Array)

    response = []
    orders = orders.group_by{|h| h['ORDER_ID']}.values
    orders.each do |order|
      station = current_event.stations.find_by_name(order[0]['STATION'].split(' - ')[1])
      account = current_event.accounts.find_by_name(order[0]['ACCOUNT_NAME'])
      order_hash = {
        scheduled_order_time: order[0]['SCHEDULED_ORDER_TIME'],
        station: station,
        charge_to_account: order[0]['IS_COMPANY_ORDER'],
        account: account,
        value: order[0]['TOTAL_VALUE'],
        customer_name: order[0]['ORDER_REFERENCE']
      }
      new_order = current_event.orders.new(order_hash)
      order_hash.merge!(order_id: order[0]['ORDER_ID'], total_value: order[0]['TOTAL_VALUE'])
      if new_order.save
        order.each do |order_item|
          item = current_event.items.find_by_name(order_item['ITEM'])
          order_item_hash = {
            item_id: item.id,
            quantity: order_item['QUANTITY'],
            value: order_item['VALUE'],
            notes: order_item['NOTES']
          }
          new_order_item = new_order.order_items.new(order_item_hash)
          if new_order_item.save
            response << order_hash.merge!(order_item_hash).merge!({success: true})
          else
            response << order_hash.merge!(order_item_hash).merge!({success: false, error: new_order_item.errors.full_messages.join(', ')})
          end
        end
      else
        response << order_hash.merge!({success: false, error: new_order.errors.full_messages.join(', ')})
      end
    end
    response
  end

  def self.validate_dependent(current_event, orders)
    items = current_event.items.pluck(:name)
    stations = current_event.stations.pluck(:name)
    accounts = current_event.accounts.pluck(:name)

    order_items = orders.collect { |i| i['ITEM'] }.uniq
    order_stations = orders.collect do |i|
      i['STATION'].split(' - ')[1]
    end.compact.uniq
    order_accounts = orders.collect do |i|
      i['ACCOUNT_NAME'] if i['ACCOUNT_NAME'].present?
    end.compact.uniq

    error = []
    error << 'Items' if (order_items - items).present?
    error << 'Stations' if (order_stations - stations).present?
    error << 'Accounts' if (order_accounts - accounts).present?

    return [{ error: error.join(', ') + ' Missing!' }] if error.present?
  end
end
