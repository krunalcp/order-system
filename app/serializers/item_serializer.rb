class ItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :quantity, :item_used, :order_no, :notes,
    :image, :status, :active, :category_id, :category_name

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
end
