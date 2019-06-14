class EventsController < ApplicationController
  before_action :authenticate_event!
  before_action :set_item, only: %i[show update destroy]

  def index
    if current_event.admin
      @events = Event.order(:name).all
    else
      @events = Event.where(id: current_event.id)
    end
    render json: @events
  end

  def create
    event = Event.new(event_params)
    event.uid = event.name
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

  def current
    if current_event
      render json: current_event
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
    params.permit(
      :name, :password, :gst_number, :admin, :active, :published_name,
      :station_id, :logo, :icon, :item_image, :help_url, :event_help_url,
      :show_date, :is_one_off, :start_date, :end_date, :earliest_preorder_date,
      :latest_preorder_date, :printed_image, :banner_message, :printouts_email,
      :phone_number, :total_costs, :number_of_tiles, :disable_print_popup,
      :second_station_id, :disable_print_popup_customer, :comments_label,
      :website, :account_id, :show_station_list
    )
  end
end
