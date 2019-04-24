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
    new_order_params = {
      customer_name: order_params[:customer_name],
      station_id: order_params[:station_id], value: order_params[:value],
      charge_to_account: order_params[:charge_to_account],
      account_id: order_params[:account_id], comments: order_params[:comments],
      scheduled_order_time: order_params[:scheduled_order_time] }

    @order = @event.orders.create(new_order_params)

    order_items = []

    order_params[:order_items].each do |item|
      item_params = {
        item_id: item[:id], quantity: item[:quantity], notes: item[:notes],
        value: item[:price].to_f.round(2), category_id: item[:category_id]
      }

      order_item = OrderItem.create(item_params)
      order_items.push(order_item)
    end

    @order.order_items = order_items

    @order.station = Station.first if @order.station.blank?

    if @order.save
      render json: { id: @order.id }
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def active_items
    @items =  Item.unscoped.where(event_id: @event.id).left_outer_joins(:category).where(active: true).order('categories.show_order asc, items.order_no asc')
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
    accounts = @event.accounts

    render json: accounts
  end

  private

  def set_event
    @event = Event.find_by_name(params[:event])
  end

  def order_params
    params.permit(
      :customer_name, :station, :station_id, :value, :scheduled_order_time,
      :account_id, :comments,
      order_items: %i[id price quantity notes category_id]
    )
  end
end
