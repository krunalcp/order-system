class ItemsController < ApplicationController
  before_action :authenticate_event!
  before_action :set_item, only: %i[show update destroy]

  def index
    @items = current_event.items.includes(:order_items, :category)

    render json: @items
  end

  def active_items
    @items =  Item.unscoped.where(event_id: current_event.id).left_outer_joins(:category).where(active: true).order('categories.show_order asc, items.order_no asc')
    render json: @items
  end

  def non_active_items
    @items =  Item.unscoped.where(event_id: current_event.id).left_outer_joins(:category).where(active: false).order('categories.show_order asc, items.order_no asc')
    render json: @items
  end

  def create
    item = current_event.items.new(item_params)

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
    summary = current_event.items.get_summary(current_event, type)

    if summary
      render json: summary
    else
      render json: { errors: ['Summary not found'] }, status: 404
    end
  end

  def last_order_number
    item = current_event.items.where(category_id: params[:category_id]).last
    if item
      render json: (item.order_no.to_i + 1)
    else
      render json: 1
    end
  end

  def import_items
    items = Item.import_items(current_event, params[:items])
    render json: items
  end

  private

  def set_item
    @item = current_event.items.find_by_id(params[:id])
  end

  def item_params
    params.permit(:name, :price, :order_no, :active, :category_id, :image, :special_price)
  end
end
