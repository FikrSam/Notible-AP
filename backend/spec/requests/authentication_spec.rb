# spec/requests/authentication_spec.rb
require 'rails_helper'

RSpec.describe 'Authentications', type: :request do
  let!(:user) { create(:user, password: 'password123') }

  describe 'POST /auth/signup' do
    context 'when valid parameters' do
      before { post '/auth/signup', params: { username: 'newuser', email: 'newuser@test.com', password: 'password123', password_confirmation: 'password123' } }

      it 'creates a new user and returns a token' do
        expect(response).to have_http_status(:created)
        expect(json['status']).to eq('success')
        expect(json['data']).to have_key('token')
      end
    end

    context 'when invalid parameters' do
      before { post '/auth/signup', params: { username: '', email: 'invalid', password: '123' } }

      it 'returns an error message' do
        expect(response).to have_http_status(:unprocessable_content)
        expect(json['status']).to eq('error')
        expect(json['message']).to include("Username can't be blank")
      end
    end
  end

  describe 'POST /auth/login' do
    context 'when valid credentials' do
      before { post '/auth/login', params: { identifier: user.email, password: 'password123' } }

      it 'returns an auth token' do
        expect(response).to have_http_status(:ok)
        expect(json['status']).to eq('success')
        expect(json['data']).to have_key('token')
      end
    end

    context 'when invalid credentials' do
      before { post '/auth/login', params: { identifier: user.email, password: 'wrongpassword' } }

      it 'returns an unauthorized error' do
        expect(response).to have_http_status(:unauthorized)
        expect(json['status']).to eq('error')
        expect(json['message']).to eq('Invalid identifier or password')
      end
    end
  end
end

# Helper method to parse JSON response body
def json
  JSON.parse(response.body)
end
