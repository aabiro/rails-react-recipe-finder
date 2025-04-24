Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # --- FIX: Add your deployed frontend's origin URL ---
    origins 'http://localhost:3000', 'https://rails-react-recipe-finder-frontend.onrender.com' # Add other origins if needed

    resource '*', # Allow requests to any resource path
      headers: :any, # Allow any headers
      methods: [:get, :post, :put, :patch, :delete, :options, :head] # Allow standard HTTP methods
  end
end
