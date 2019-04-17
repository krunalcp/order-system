class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :item, :item_id, :quantity, :value, :price, :notes,
             :category_name, :category_id

  def item
    item = object.item

    item ? item.name : nil
  end

  def price
    item = object.item

    item ? item.price : nil
  end

  def category_name
    object.category.try(:name) || ''
  end
end
