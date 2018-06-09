class ItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :quantity

  def quantity
  	0
  end
end
