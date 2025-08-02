# config/routes.rb
Rails.application.routes.draw do
  post "/auth/signup", to: "authentication#signup"
  post "/auth/login", to: "authentication#login"
  get "/notes/username", to: "notes#get_username"
  resources :notes, only: [ :index, :show, :create, :update, :destroy ]
end
