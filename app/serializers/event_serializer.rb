class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :password, :gst_number, :admin, :active
end
