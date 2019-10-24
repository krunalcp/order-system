class ItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :quantity, :item_used, :order_no, :notes,
             :image, :status, :active, :category_id, :category_name,
             :special_price, :favourite_quantity, :value, :label

  def quantity
    if object.favourite_quantity.present?
      object.favourite_quantity
    else
      0
    end
  end

  def item_used
    object.order_items.present?
  end

  def status
    object.active? ? 'Active' : 'Inactive'
  end

  def category_name
    object.category.try(:name) || ''
  end

  def favourite_quantity
    object.favourite_quantity.to_i
  end

  def value
    object.id
  end

  def label
    object.name
  end
end
