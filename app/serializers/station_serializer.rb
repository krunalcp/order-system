class StationSerializer < ActiveModel::Serializer
  attributes :id, :name, :next, :prev, :refresh_time, :next_station_id, :next_station, :separate_by_category, :station_used

  def next
    next_val = object.next

    next_val ? next_val.id : nil
  end

  def next_station
    object.next
  end

  def prev
    prev_val = object.prev

    prev_val ? prev_val.id : nil
  end

  def station_used
    object.orders.present?
  end
end
