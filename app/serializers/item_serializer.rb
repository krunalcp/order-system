class ItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :quantity, :item_used

  def quantity
  	0
  end

  def item_used
   orders = Order.all.pluck(:id)
   order_items = OrderItem.where(order_id: orders).pluck(:item).include?(object.name)
  end
end
