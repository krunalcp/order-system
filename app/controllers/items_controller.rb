class ItemsController < ApplicationController
  before_action :set_item, only: %i[show update destroy]

  def index
    @items = Item.all

    render json: @items
  end

  def active_items
    @items = Item.where(active: true)

    render json: @items
  end

  def create
    item = Item.new(item_params)

    if item.save
      head :ok
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    if @item
      render json: @item
    else
      render json: { errors: ['Item not found'] }, status: 404
    end
  end

  def update
    if @item
      if @item.update(item_params)
        head :ok
      else
        render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['Item not found'] }, status: 404
    end
  end

  def destroy
    if @item && @item.destroy
      head :ok
    else
      render json: { errors: ['Item not found'] }, status: 404
    end
  end

  def order_summary
    type =  %w[quantity value].include?(params[:type]) ? params[:type] : 'quantity'
    summary = Item.get_summary(type)

    if summary
      render json: summary
    else
      render json: { errors: ['Summary not found'] }, status: 404
    end
  end

  def last_order_number
    item = Item.last
    if item
      render json: (item.order_no || 0) + 1
    else
      head :ok
    end
  end

  private

  def set_item
    @item = Item.find_by_id(params[:id])
  end

  def item_params
    params.permit(:name, :price, :order_no, :active, :category_id)
  end
end
