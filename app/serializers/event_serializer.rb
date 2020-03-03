class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :password, :gst_number, :admin, :active, :logo, :icon,
             :published_name, :station_id, :station_name, :item_image,
             :help_url, :event_help_url, :show_date, :is_one_off, :start_date,
             :end_date, :is_allowed_to_order, :earliest_preorder_date,
             :latest_preorder_date, :printed_image, :banner_message,
             :printouts_email, :phone_number, :total_costs, :number_of_tiles,
             :number_of_tiles_array, :disable_print_popup, :second_station_id,
             :disable_print_popup_customer, :comments_label, :website,
             :account_id, :show_station_list, :hide_site_page, :last_order_station_id,
             :admin_password, :hide_event_help_url, :hide_help_url

  def station_name
    object.station.try(:name)
  end

  def number_of_tiles_array
    (1..object.number_of_tiles.to_i).to_a
  end

  def is_allowed_to_order
    (object.start_date.blank? || Date.today >= object.start_date) && (object.end_date.blank? || Date.today <= object.end_date)
  end

  def last_order_station_id
    object.orders.order(created_at: :desc).first.try(:station_id)
  end
end
