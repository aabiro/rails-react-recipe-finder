# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

# config/initializers/cors.rb
# config/initializers/cors.rb (in Rails project)
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Add the URL of your deployed React app here
    origins 'http://localhost:3000', 'https://rails-react-recipe-finder-frontend.onrender.com/'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
