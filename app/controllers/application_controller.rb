# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  def authorize_request
    header = request.headers["Authorization"]
    header = header.split(" ").last if header
    begin
      @decoded = JsonWebToken.decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { status: "error", message: e.message }, status: :unauthorized
    rescue ExceptionHandler::InvalidToken => e
      render json: { status: "error", message: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { status: "error", message: e.message }, status: :unauthorized
    end
  end
end
