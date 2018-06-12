class OrdersController < ApplicationController
	def index
    order = params[:s] == '1' ? 'asc' : 'desc'
		@orders = Order.includes(:order_items).all.order("created_at #{order}")

		render json: @orders
	end

	def create
		new_order_params = {customer_name: order_params[:customer_name], station_id: order_params[:station_id], value: order_params[:value], charge_to_account: order_params[:charge_to_account]}

		@order = Order.create(new_order_params)

		order_items = []

		order_params[:order_items].each do |item|
			item_price = item[:price] * item[:quantity]
			item_params = {item: item[:name], quantity: item[:quantity], value: item_price}

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
				item_price = item[:price] * item[:quantity]
				item_params = {item: item[:name], quantity: item[:quantity], value: item_price}

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
		params.permit(:customer_name, :station, :station_id, :value, :charge_to_account, :order_items => [:name, :price, :quantity])
	end
end
