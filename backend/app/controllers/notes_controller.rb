# app/controllers/notes_controller.rb
class NotesController < ApplicationController
  before_action :authorize_request
  before_action :set_note, only: [ :show, :update, :destroy ]

  # GET /notes
  def index
    notes = @current_user.notes
    notes = notes.where("title LIKE ? OR content LIKE ?", "%#{params[:q]}%", "%#{params[:q]}%") if params[:q].present?
    notes = notes.where("tags LIKE ?", "%#{params[:tag]}%") if params[:tag].present?

    render json: { status: "success", data: notes }, status: :ok
  end

  # GET /notes/:id
  def show
    render json: { status: "success", data: @note }, status: :ok
  end

  # POST /notes
  def create
    note = @current_user.notes.new(note_params)
    if note.save
      render json: { status: "success", message: "Note created successfully.", data: note }, status: :created
    else
      render json: { status: "error", message: note.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  # PUT /notes/:id
  def update
    if @note.update(note_params)
      render json: { status: "success", message: "Note updated successfully.", data: @note }, status: :ok
    else
      render json: { status: "error", message: @note.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  # DELETE /notes/:id
  def destroy
    @note.destroy
    render json: { status: "success", message: "Note deleted successfully." }, status: :ok
  end

  # GET /notes/username
  def get_username
    render json: { status: "success", data: { username: @current_user.username } }, status: :ok
  end

  private

  def set_note
    @note = @current_user.notes.find_by!(id: params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: "error", message: "Note not found." }, status: :not_found
  end

  def note_params
    params.permit(:title, :content, :tags)
  end
end
