# app/controllers/authentication_controller.rb
class AuthenticationController < ApplicationController
  # POST /auth/signup
  def signup
    user = User.new(user_params)
    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: { status: "success", message: "Registration successful!", data: { token: token, username: user.username } }, status: :created
    else
      render json: { status: "error", message: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  # POST /auth/login
  def login
    user = User.find_by("email = :identifier OR username = :identifier", identifier: params[:identifier])
    if user && user.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { status: "success", message: "Login successful!", data: { token: token, username: user.username } }, status: :ok
    else
      render json: { status: "error", message: "Invalid identifier or password" }, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(:username, :email, :password, :password_confirmation)
  end
end
