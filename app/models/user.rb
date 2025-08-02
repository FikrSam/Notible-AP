# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  has_many :notes, dependent: :destroy

  validates :username, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6 }, on: :create
end
