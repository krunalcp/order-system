class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :password, :gst_number, :admin, :active,
             :published_name, :station_id, :station_name

  def station_name
    object.station.try(:name)
  end
end
