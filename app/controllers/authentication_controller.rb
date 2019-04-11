class AuthenticationController < ApplicationController

  def login
    account = Account.find_by_email(params[:email])
    if account&.authenticate(params[:password])
      token = JwtToken.encode(account_id: account.id)
      render_response({
        token: token,
        account_id: account.id,
        event_id: account.event_id
      })
    else
      message_response('Invalid Login', 'Error', :unauthorized)
    end
  end
end
