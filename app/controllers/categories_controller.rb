class CategoriesController < ApplicationController
  before_action :authenticate_event!
  before_action :set_category, only: %i[show update destroy]

  def index
    @categories = current_event.categories

    render json: @categories
  end

  def create
    category = current_event.categories.new(category_params)

    if category.save
      head :ok
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    if @category
      render json: @category
    else
      render json: { errors: ['Category not found'] }, status: 404
    end
  end

  def update
    if @category
      if @category.update(category_params)
        head :ok
      else
        render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['Category not found'] }, status: 404
    end
  end

  def destroy
    if @category && @category.destroy
      head :ok
    else
      render json: { errors: ['Category not found'] }, status: 404
    end
  end

  private

  def set_category
    @category = current_event.categories.find_by_id(params[:id])
  end

  def category_params
    params.permit(:name, :show_order)
  end
end