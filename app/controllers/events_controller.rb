class EventsController < ApplicationController
  before_action :authenticate_current_event
  before_action :set_item, only: %i[show update destroy]

  def index
    @events = Event.all

    render json: @events
  end

  def create
    event = Event.new(event_params)

    if event.save
      head :ok
    else
      render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    if @event
      render json: @event
    else
      render json: { errors: ['Event not found'] }, status: 404
    end
  end

  def update
    if @event
      if @event.update(event_params)
        head :ok
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['Event not found'] }, status: 404
    end
  end

  def destroy
    if @event && @event.destroy
      head :ok
    else
      render json: { errors: ['Event not found'] }, status: 404
    end
  end

  private

  def set_item
    @event = Event.find_by_id(params[:id])
  end

  def event_params
    params.permit(:name, :password, :gst_number, :admin, :active)
  end
end
