class OrdersController < ApplicationController
  before_action :set_pagination, only: :index
	def index
    station_order = (params[:s].to_i > 0)
    order = station_order ? 'asc' : 'desc'

    @orders = Order.includes([:station, :order_items]).order("created_at #{order}")

    if params[:all] == "true"
      render json: @orders
    else
      if station_order
        @orders = @orders.where(station_id: params[:s])
      end
      @total = @orders.count
      @orders = @orders.limit(@per_page).offset(@offset)

      if params[:oo] == "1"
        render json: @orders
      else
  		  render json: { orders: @orders, total: @total, page: @page, per: @per_page }
      end
    end
	end

	def create
		new_order_params = {customer_name: order_params[:customer_name], station_id: order_params[:station_id], value: order_params[:value], charge_to_account: order_params[:charge_to_account]}

		@order = Order.create(new_order_params)

		order_items = []

		order_params[:order_items].each do |item|
			item_params = {item: item[:name], quantity: item[:quantity], value: item[:price].to_f.round(2), notes: item[:notes]}

			order_item = OrderItem.create(item_params)
			order_items.push(order_item)
		end

		@order.order_items = order_items

		@order.station = Station.first if @order.station.blank?

		if @order.save
			render json: {id: @order.id}
		else
			render json: {errors: order.errors.full_messages}, status: :unprocessable_entity
		end
	end


	def show
		order = Order.find(params[:id])

		if order
			render json: order
		else
			render json: {errors: ['order not found']}, status: 404
		end
	end

	def update
		@order = Order.find(params[:id])

		if @order
			new_order_params = {customer_name: order_params[:customer_name], station_id: order_params[:station_id], value: order_params[:value], charge_to_account: order_params[:charge_to_account]}

			order_items = []

			order_params[:order_items].each do |item|
				item_params = {item: item[:name], quantity: item[:quantity], value: item[:price].to_f.round(2), notes: item[:notes]}

				order_item = OrderItem.create(item_params)
				order_items.push(order_item)
			end

			@order.order_items = order_items

			if @order.update(new_order_params)

				head :ok
			else
				render json: {errors: @order.errors.full_messages}, status: :unprocessable_entity
			end
		else
			render json: {errors: ['order not found']}, status: 404
		end
	end

	def destroy
		order = Order.find(params[:id])

		if order.destroy
			head :ok
		else
			render json: {errors: ['order not found']}, status: 404
		end
	end

	def mark_fulfilled
		order = Order.find(params[:id])

		current_station = order.station
		new_station = current_station.next
		order.station = new_station ? new_station : current_station
		if order.save
			head :ok
		else
			render json: {errors: ['order not found']}, status: 404
		end
	end

	private

	def order_params
		params.permit(:customer_name, :station, :station_id, :value, :charge_to_account, :order_items => [:name, :price, :quantity, :notes])
	end
end
