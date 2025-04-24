Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Use resources for standard RESTful routes
      resources :recipes, only: [:index]
      # The generator might have added this, which is also fine for just index:
      # get 'recipes/index'
    end
  end
end
