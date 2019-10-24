class AccountOrdersController < ApplicationController
  before_action :set_event, only: %i[login create]
  before_action :set_account, only: %i[login create]

  def login
    if @account
      render json: @account
    else
      render json: { errors: ['account not found'] }, status: 404
    end
  end

  def show
    order = @event.orders.find(params[:id])

    if order
      render json: order
    else
      render json: { errors: ['order not found'] }, status: 404
    end
  end

  def create
    last_order = @event.orders.where.not(order_number: nil).order(order_number: :desc).first
    order_number = last_order.try(:order_number).to_i + 1
    station_id = @account.station_id

    new_order_params = {
      station_id: station_id, value: order_params[:value],
      order_number: order_number, account_id: @account.id
    }

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
    end

    @order.order_items = order_items

    @order.station = @event.stations.first if @order.station_id.blank?

    if @order.save
      render json: { id: @order.id }
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find_by_name(params[:event])
  end

  def set_account
    @account = @event.accounts.find_by_number(params[:number])
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
