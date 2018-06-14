class StationsController < ApplicationController

  def index
    stations = Station.all.order('created_at')

    render json: stations
  end

  def create
    Station.create(station_params)

    head :ok
  end


  def show
    station = Station.find(params[:id])

    if station
      render json: station
    else
      render json: {errors: ['Station not found']}, status: 404
    end
  end

  def update
    station = Station.find(params[:id])

    if station
      if station.update(station_params)
        head :ok
      else
        render json: {errors: station.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {errors: ['Station not found']}, status: 404
    end
  end

  def destroy
    station = Station.find(params[:id])

    if station.destroy
      head :ok
    else
      render json: {errors: ['Station not found']}, status: 404
    end
  end

  private

  def station_params
    params.permit(:name, :refresh_time, :next_station_id)
  end
end
