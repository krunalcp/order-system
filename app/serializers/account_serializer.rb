class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :contact_name, :email, :phone, :items

  def items
    order_items = object.order_items.select(
      'order_items.item_id, sum(order_items.quantity) as quantity, ' \
      'sum(order_items.value * order_items.quantity) as value'
    ).group(:item_id)

    items, sq, sv = [], 0, 0
    order_items.each do |oi|
      items << { item: oi.item.name, quantity: oi.quantity, value: oi.value }
      sq += oi.quantity
      sv += oi.value
    end
    items << { item: 'TOTAL', quantity: sq, value: sv } if sq.positive?
  end
end
