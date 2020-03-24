class AuthenticationController < ApplicationController

  def login
    event = Event.find_by_name(params[:event])
    account = event.accounts.find_by_name(params[:name])
    if account&.password_digest.present? && account&.authenticate(params[:password])
      token = JwtToken.encode(account_id: account.id)
      render_response({
        token: token,
        account_id: account.id,
        event_id: account.event_id,
        event_name: account.event.name
      })
    else
      message_response('Invalid Login', 'Error', :unauthorized)
    end
  end
end
