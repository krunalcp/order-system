class AccountsController < ApplicationController
  before_action :authenticate_current_event
  before_action :set_account, only: %i[show update destroy]

  def index
    @accounts = current_event.accounts

    render json: @accounts
  end

  def create
    account = current_event.accounts.new(account_params)

    if account.save
      head :ok
    else
      render json: { errors: account.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    if @account
      render json: @account
    else
      render json: { errors: ['Account not found'] }, status: 404
    end
  end

  def update
    if @account
      if @account.update(account_params)
        head :ok
      else
        render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['Account not found'] }, status: 404
    end
  end

  def destroy
    if @account && @account.destroy
      head :ok
    else
      render json: { errors: ['Account not found'] }, status: 404
    end
  end

  private

  def set_account
    @account = current_event.accounts.find_by_id(params[:id])
  end

  def account_params
    params.permit(:name, :contact_name, :email, :phone)
  end
end
