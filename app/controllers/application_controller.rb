class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :configure_permitted_parameters, if: :devise_controller?

  def set_pagination
    @page = params[:page].to_i > 0 ? params[:page].to_i : 1
    @per_page = 10
    @offset = (@page - 1) * @per_page
  end

  def authenticate_current_event
     head :unauthorized if current_event.nil?
  end

  def current_event
    Event.find_by("tokens LIKE '%#{request.headers['access-token']}%'") if request.headers['access-token'].present?
  end

  protected

  def configure_permitted_parameters
    added_attrs = [:name, :admin, :active, :gst_number]
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit :sign_in, keys: [:name]
    devise_parameter_sanitizer.permit :account_update, keys: added_attrs
  end
end
