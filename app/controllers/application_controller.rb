class ApplicationController < ActionController::API
  def set_pagination
    @page = params[:page].to_i > 0 ? params[:page].to_i : 1
    @per_page = 2
    @offset = (@page - 1) * @per_page
  end
end
