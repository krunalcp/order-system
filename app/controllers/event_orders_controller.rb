class EventOrdersController < ApplicationController
  before_action :set_event

  def show
    order = @event.orders.find(params[:id])

    if order
      render json: order
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end


  def create
    last_order = @event.orders.where.not(order_number: nil).order(created_at: :desc).first
    order_number = last_order.try(:order_number).to_i + 1
    new_order_params = {
      customer_name: order_params[:customer_name],
      station_id: order_params[:station_id], value: order_params[:value],
      charge_to_account: order_params[:charge_to_account],
      account_id: order_params[:account_id], comments: order_params[:comments],
      scheduled_order_time: order_params[:scheduled_order_time],
      order_number: order_number }

    @order = @event.orders.create(new_order_params)

    order_items = []

    order_params[:order_items].each do |item|
      item_params = {
        item_id: item[:id], quantity: item[:quantity], notes: item[:notes],
        value: item[:price].to_f.round(2), category_id: item[:category_id]
      }
      if item[:special_price].present? && item[:special_price].to_f != 0
        item_params[:value] = item[:special_price].to_f.round(2)
      end

      order_item = OrderItem.create(item_params)
      order_items.push(order_item)

      if item[:default_quantity]
        account_favourite = @event.account_favourites.find_by(account_id: params[:account_id], item_id: item[:id])
        if account_favourite.present?
          account_favourite.update_attributes(quantity: item[:quantity])
        end
      end
    end

    @order.order_items = order_items
    @order.station = @event.stations.first if @order.station_id.blank?

    if @order.save
      render json: { id: @order.id }
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def active_items
    @items =  Item.unscoped.where(event_id: @event.id)
    .left_outer_joins(:category).where(active: true)
    .order('categories.show_order asc, items.order_no asc')

    if params[:account_id].present?
      item_ids = @event.account_favourites.where(account_id: params[:account_id]).pluck(:item_id)
      @items = @items.where.not(id: item_ids)
    end

    render json: @items
  end

  def favourite_items
    @items =  Item.unscoped.where(event_id: @event.id)
    .joins(:account_favourites).includes(:account_favourites)
    .where('item_id = items.id and account_favourites.account_id = ?', params[:account_id]).order(:name)

    @items.each do |item|
      item.favourite_quantity = item.account_favourites.first.quantity
    end
    render json: @items
  end

  def event
    if @event
      render json: @event
    else
      render json: { errors: ['Event not found'] }, status: 404
    end
  end

  def stations
    stations = @event.stations.order('created_at')
    render json: stations
  end

  def accounts
    accounts = @event.accounts.where(is_active: true)

    render json: accounts
  end

  def favourite
    favourite_item = @event.account_favourites.find_or_initialize_by(
      item_id: params[:item_id], account_id: params[:account_id])
    if favourite_item.save
      render json: { favourite: true }
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def remove_favourite
    favourite_item = @event.account_favourites.find_by(
      item_id: params[:item_id], account_id: params[:account_id])
    if favourite_item.present?
      favourite_item.destroy
    end
    render json: { favourite: false }
  end

  def change_default_quantity
    favourite_item = @event.account_favourites.find_by(
      item_id: params[:item_id], account_id: params[:account_id])
    if favourite_item.present?
      favourite_item.update_attributes(quantity: params[:quantity])
    end
    render json: { favourite: false }
  end

  private

  def set_event
    @event = Event.find_by_name(params[:event])
  end

  def order_params
    params.permit(
      :customer_name, :station, :station_id, :value, :scheduled_order_time,
      :account_id, :comments, order_items: %i[
        id price quantity notes category_id default_quantity special_price
      ]
    )
  end
end
