class ItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :quantity, :item_used, :order_no, :notes, :status, :active

  def quantity
  	0
  end

  def item_used
   order_items = OrderItem.where.not(order_id: nil).where(item: object.name).present?
  end

  def status
    object.active? ? 'Active' : 'Inactive'
  end
end
