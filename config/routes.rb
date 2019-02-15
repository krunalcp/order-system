Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :items do
    collection do
      get 'order_summary'
      get 'active_items'
      get 'last_order_number'
    end
  end

  resources :orders do
  	collection do
  		get 'pending_list'
  	end

  	member do
  		put 'mark_fulfilled'
  	end
  end

  resources :stations
end
