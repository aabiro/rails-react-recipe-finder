# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :recipes, only: [:index]
    end
  end

  # --- ADDED ROOT ROUTE ---
  # Defines the root path route ("/") to point to the API's recipe index action
  root 'api/v1/recipes#index'
  # ------------------------
end
