Rails.application.routes.draw do
  mount_devise_token_auth_for 'Event', at: 'auth'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :items do
    collection do
      get 'order_summary'
      get 'active_items'
      get 'last_order_number'
    end
  end

  resources :categories
  resources :events do
    collection do
      get 'current'
    end
  end
  resources :accounts

  resources :orders do
    collection do
      get 'pending_list'
    end

    member do
      put 'mark_fulfilled'
      put 'mark_item_fulfilled'
    end
  end

  resources :stations
end
