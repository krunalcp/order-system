class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :password, :gst_number, :admin, :active, :logo, :icon,
             :published_name, :station_id, :station_name, :item_image,
             :help_url, :event_help_url, :show_date

  def station_name
    object.station.try(:name)
  end
end
