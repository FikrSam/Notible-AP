# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # This is where you specify the origin of your frontend application
    # If the frontend is running on http://localhost:3000, use that.
    # For deployment, you will change this to our actual domain.
    origins "http://localhost:3000"

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true
  end
end
