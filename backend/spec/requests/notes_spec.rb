# spec/requests/notes_spec.rb
require 'rails_helper'

RSpec.describe 'Notes', type: :request do
  let!(:user) { create(:user) }
  let!(:another_user) { create(:user) }
  let!(:notes) { create_list(:note, 5, user: user) }
  let!(:auth_token) { JsonWebToken.encode(user_id: user.id) }
  let!(:headers) { { 'Authorization' => auth_token } }

  describe 'GET /notes' do
    context 'when authenticated' do
      before { get '/notes', headers: headers }

      it 'returns all notes for the current user' do
        expect(response).to have_http_status(:ok)
        expect(json['data'].size).to eq(5)
      end
    end

    context 'when not authenticated' do
      before { get '/notes' }

      it 'returns an unauthorized error' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /notes' do
    let(:valid_params) { { title: 'New Note', content: 'Some content here' } }
    let(:invalid_params) { { title: '', content: '' } }

    context 'when valid parameters and authenticated' do
      before { post '/notes', params: valid_params, headers: headers }

      it 'creates a new note' do
        expect(response).to have_http_status(:created)
        expect(json['data']['title']).to eq('New Note')
      end
    end

    context 'when invalid parameters and authenticated' do
      before { post '/notes', params: invalid_params, headers: headers }

      it 'returns an unprocessable entity error' do
        expect(response).to have_http_status(:unprocessable_content)
        expect(json['status']).to eq('error')
      end
    end
  end

  describe 'PUT /notes/:id' do
    let(:note) { notes.first }
    let(:updated_title) { 'Updated Title' }

    context 'when authenticated and note belongs to user' do
      before { put "/notes/#{note.id}", params: { title: updated_title }, headers: headers }

      it 'updates the note' do
        expect(response).to have_http_status(:ok)
        expect(note.reload.title).to eq(updated_title)
      end
    end

    context 'when authenticated but note belongs to another user' do
      let(:another_note) { create(:note, user: another_user) }
      before { put "/notes/#{another_note.id}", params: { title: updated_title }, headers: headers }

      it 'returns a not found error' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE /notes/:id' do
    let(:note_to_delete) { notes.first }

    context 'when authenticated and note belongs to user' do
      before { delete "/notes/#{note_to_delete.id}", headers: headers }

      it 'deletes the note' do
        expect(response).to have_http_status(:ok)
        expect(Note.exists?(note_to_delete.id)).to be_falsey
      end
    end
  end
end
