# frozen_string_literal: true

#:nodoc:
module Response
  def render_response(object, status_code = :ok)
    render json: object, status: status_code
  end

  def message_response(message, status = 'Success', http_status = :ok)
    response = {
      status: status,
      message: message
    }
    render_response(response, http_status)
  end

  def not_found
    message_response('Record not found', 'Error', :not_found)
  end
end
