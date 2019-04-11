Rails.application.routes.draw do
  mount_devise_token_auth_for 'Event', at: 'auth'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  post '/account/login', to: 'authentication#login'

  resources :items do
    collection do
      get 'order_summary'
      get 'active_items'
      get 'last_order_number'
      post 'import_items'
    end
  end

  resources :categories
  resources :events do
    collection do
      get 'current'
    end
  end
  resources :accounts

  resources :event_orders, path: ':event/orders', only: [:create] do
    collection do
      get 'active_items'
      get 'event'
      get 'accounts'
      get 'stations'
    end
  end

  resources :orders do
    collection do
      get 'pending_list'
      post 'import_orders'
    end

    member do
      put 'mark_fulfilled'
      put 'mark_item_fulfilled'
    end
  end

  resources :stations
end
