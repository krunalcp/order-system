class OrderSerializer < ActiveModel::Serializer
	attributes :id, :customer_name, :station, :value, :created_at, :station_id, :charge_to_account, :scheduled_order_time, :display_scheduled_order_time

	has_many :order_items

	def created_at
		(object.created_at + 12.hour).strftime("%m/%d/%Y %H:%M:%S");
	end

  def station
    object.station
  end

  def scheduled_order_time
    object.scheduled_order_time.try(:strftime, "%FT%T");
  end

  def display_scheduled_order_time
    object.scheduled_order_time.try(:strftime, "%m/%d/%Y %H:%M:%S");
  end

end
