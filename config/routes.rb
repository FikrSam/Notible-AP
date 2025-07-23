# config/routes.rb
Rails.application.routes.draw do
  # Authentication Routes
  post 'auth/signup', to: 'authentication#signup'
  post 'auth/login', to: 'authentication#login'

  # Custom route to get the username
  get 'notes/username', to: 'notes#get_username'

  # Notes Routes (CRUD operations)
  resources :notes
end
