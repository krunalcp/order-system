class OrdersController < ApplicationController
  before_action :authenticate_event!
  before_action :set_pagination, only: :index

  def index
    sort_by = %w[scheduled_order_time station_id value].include?(params[:sort_by]) ? params[:sort_by] : 'scheduled_order_time'
    order   = params[:sort_order].present? && params[:sort_order] == 'asc' ? 'asc' : 'desc'
    @orders = current_event.orders.includes(%i[station order_items]).order("#{sort_by} #{order}")

    if params[:all] == 'true'
      render json: @orders
    else
      @orders = @orders.where(station_id: params[:s]) if params[:s].to_i > 0
      @total  = @orders.count
      @orders = @orders.limit(@per_page).offset(@offset)

      if params[:oo] == '1'
        render json: @orders
      else
        render json: { orders: @orders, total: @total, page: @page, per: @per_page }
      end
    end
  end

  def create
    new_order_params = { customer_name: order_params[:customer_name], station_id: order_params[:station_id], value: order_params[:value], charge_to_account: order_params[:charge_to_account], account_id: order_params[:account_id], scheduled_order_time: order_params[:scheduled_order_time] }

    @order = current_event.orders.create(new_order_params)

    order_items = []

    order_params[:order_items].each do |item|
      item_params = { item: item[:name], quantity: item[:quantity], value: item[:price].to_f.round(2), notes: item[:notes], category_id: item[:category_id] }

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

  def show
    order = current_event.orders.find(params[:id])

    if order
      render json: order
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end

  def update
    @order = current_event.orders.find(params[:id])

    if @order
      new_order_params = { customer_name: order_params[:customer_name], station_id: order_params[:station_id], value: order_params[:value], charge_to_account: order_params[:charge_to_account], account_id: order_params[:account_id], scheduled_order_time: order_params[:scheduled_order_time] }

      order_items = []

      order_params[:order_items].each do |item|
        item_params = { item: item[:name], quantity: item[:quantity], value: item[:price].to_f.round(2), notes: item[:notes], category_id: item[:category_id] }

        order_item = OrderItem.create(item_params)
        order_items.push(order_item)
      end

      @order.order_items = order_items

      if @order.update(new_order_params)

        head :ok
      else
        render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end

  def destroy
    order = current_event.orders.find(params[:id])

    if order.destroy
      head :ok
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end

  def mark_fulfilled
    order = current_event.orders.find(params[:id])
    order.fulfilled = ''
    current_station = order.station
    new_station = current_station.next
    order.station = new_station || current_station
    if order.save
      head :ok
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end

  def mark_item_fulfilled
    order = current_event.orders.find(params[:id])
    order.fulfilled = order.fulfilled.to_s + ',' + params[:c] if params[:c]

    category_ids = order.order_items.pluck(:category_id)
    fulfilled_category_ids = order.fulfilled.split(",").map(&:to_i)

    if (category_ids - fulfilled_category_ids).blank?
      current_station = order.station
      new_station = current_station.next
      order.station = new_station || current_station
      order.fulfilled = ''
    end

    if order.save
      head :ok
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end

  private

  def order_params
    params.permit(:customer_name, :station, :station_id, :value, :scheduled_order_time, :account_id, order_items: %i[name price quantity notes category_id])
  end
end
