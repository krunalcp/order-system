class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :show_order, :category_used

  def category_used
    object.items.present?
  end
end
