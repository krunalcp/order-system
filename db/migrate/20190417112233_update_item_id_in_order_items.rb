class UpdateItemIdInOrderItems < ActiveRecord::Migration[5.1]
  def change
    Event.all.each do |event|
      event.items.each do |item|
        OrderItem.where(
          'order_id in (select id from orders where event_id = ?) and item = ?',
          event.id, item.name
        ).update_all(item_id: item.id)
      end
    end
  end
end
