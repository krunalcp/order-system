class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :item, :quantity, :value, :price, :notes, :category_name, :category_id

  def price
    item = Item.find_by(name: object.item)

    item ? item.price : nil
  end

  def category_name
    object.category.try(:name) || ''
  end
end
