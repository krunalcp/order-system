class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :item, :item_id, :quantity, :value, :price, :notes,
             :category_name, :category_id, :special_price, :account_name, :order

  def item
    item = object.item

    item ? item.name : nil
  end

  def price
    item = object.item

    item ? item.price : nil
  end

  def special_price
    item = object.item

    item ? item.special_price : nil
  end

  def account_name
    object.order.account.try(:name)
  end

  def category_name
    object.category.try(:name) || ''
  end
end
