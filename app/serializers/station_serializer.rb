class StationSerializer < ActiveModel::Serializer
  attributes :id, :name, :next, :prev

  def next
    next_val = object.next

    next_val ? next_val.id : nil
  end

  def prev
    prev_val = object.prev

    prev_val ? prev_val.id : nil
  end
end
