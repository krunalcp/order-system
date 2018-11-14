class ItemsController < ApplicationController
  def index
    @items = Item.all

    render json: @items
  end

  def create
    Item.create(item_params)

    head :ok
  end

  def show
    item = Item.find(params[:id])

    if item
      render json: item
    else
      render json: { errors: ['Item not found'] }, status: 404
    end
  end

  def update
    item = Item.find(params[:id])

    if item
      if item.update(item_params)
        head :ok
      else
        render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['Item not found'] }, status: 404
    end
  end

  def destroy
    item = Item.find(params[:id])

    if item.destroy
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

  private

  def item_params
    params.permit(:name, :price, :order_no)
  end
end
