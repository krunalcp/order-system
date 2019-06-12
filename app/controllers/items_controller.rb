class ItemsController < ApplicationController
  before_action :authenticate_event!
  before_action :set_item, only: %i[show update destroy]
  before_action :set_pagination, only: :production_notes

  def index
    @items = Item.unscoped.where(event_id: current_event.id).left_outer_joins(:category).order('categories.show_order asc, items.order_no asc')

    render json: @items
  end

  def active_items
    @items = Item.unscoped.where(event_id: current_event.id).left_outer_joins(:category).where(active: true).order('categories.show_order asc, items.order_no asc')
    render json: @items
  end

  def non_active_items
    @items = Item.unscoped.where(event_id: current_event.id).left_outer_joins(:category).where(active: false).order('categories.show_order asc, items.order_no asc')
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

    summary = current_event.items.get_summary(current_event, type, params[:period])

    if summary
      render json: summary
    else
      render json: { errors: ['Summary not found'] }, status: 404
    end
  end

  def total_sales_profit
    condition = if params[:period] == 'current'
      [
        "((scheduled_order_time >= ? and scheduled_order_time <= ?) or (created_at >= ? and created_at <= ?))",
        Time.now.beginning_of_month, Time.now.end_of_month,
        Time.now.beginning_of_month, Time.now.end_of_month
      ]
    elsif params[:period] == 'last'
      [
        "((scheduled_order_time >= ? and scheduled_order_time <= ?) or (created_at >= ? and created_at <= ?))",
        DateTime.now.prev_month.beginning_of_month, DateTime.now.prev_month.end_of_month,
        DateTime.now.prev_month.beginning_of_month, DateTime.now.prev_month.end_of_month
      ]
    else
      []
    end

    sales = current_event.orders.where(condition).sum(:value).to_f
    total_costs = current_event.total_costs.to_f
    profit = sales - total_costs
    render json: { sales: sales, total_costs: total_costs,  profit: profit, positive_profit: profit.positive? }
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

  def station_item
    station_item = OrderItem.joins("INNER JOIN orders ON order_items.order_id = orders.id").where(
      "orders.station_id IN (?) and order_items.item_id = ?", params[:station_id].to_s.split(',').map{|s| s.to_i}, params[:item_id]
    ).sum(:quantity)
    render json: station_item
  end

  def production_notes
    @order_items = OrderItem.joins("INNER JOIN orders ON order_items.order_id = orders.id").includes(
      :item, :category, order: [:account, :station, :items]
    ).where(
      "orders.station_id IN (?) and order_items.item_id IN (?) and order_items.notes != ''", params[:s].to_s.split(',').map{|s| s.to_i}, params[:i].to_s.split(',').map{|s| s.to_i}
    )

    if params[:all] == 'true'
      render json: @order_items
    else
      @total  = @order_items.count
      @order_items = @order_items.limit(@per_page).offset(@offset)

      if params[:oo] == '1'
        render json: @order_items
      else
        render json: {
          order_items: @order_items, total: @total, page: @page, per: @per_page
        }
      end
    end
  end

  private

  def set_item
    @item = current_event.items.find_by_id(params[:id])
  end

  def item_params
    params.permit(:name, :price, :order_no, :active, :category_id, :image, :special_price)
  end
end
