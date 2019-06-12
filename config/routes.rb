Rails.application.routes.draw do
  mount_devise_token_auth_for 'Event', at: 'auth'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  post '/account/login', to: 'authentication#login'

  resources :items do
    collection do
      get 'order_summary'
      get 'active_items'
      get 'non_active_items'
      get 'last_order_number'
      post 'import_items'
      get 'total_sales_profit'
      get 'station_item'
      get 'production_notes'
    end
  end

  resources :categories do
    collection do
      get 'last_show_order'
    end
  end

  resources :events do
    collection do
      get 'current'
    end
  end
  resources :accounts

  resources :event_orders, path: ':event/orders', only: [:create, :show] do
    collection do
      get 'active_items'
      get 'favourite_items/:account_id', action: :favourite_items
      get 'event'
      get 'accounts'
      get 'stations'
      get 'favourite/:item_id/:account_id', action: :favourite
      get 'remove_favourite/:item_id/:account_id', action: :remove_favourite
      get 'change_default_quantity/:item_id/:account_id', action: :change_default_quantity
    end
  end

  resources :orders do
    collection do
      get 'pending_list'
      post 'import_orders'
      get 'last_order_number'
    end

    member do
      put 'mark_fulfilled'
      put 'mark_item_fulfilled'
    end
  end

  resources :stations
end
