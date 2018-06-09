class OrderSerializer < ActiveModel::Serializer
	attributes :id, :customer_name, :station, :value, :created_at

	has_many :order_items

	def created_at
		(object.created_at + 12.hour).strftime("%m/%d/%Y %H:%M:%S");
	end

  def station
    object.station
  end

end