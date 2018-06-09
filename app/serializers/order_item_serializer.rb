class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :item, :quantity, :value, :price

  def price
    item = Item.find_by(name: object.item)

    item ? item.price : nil
  end
end
