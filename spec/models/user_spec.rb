# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  # Test associations
  it { should have_many(:notes).dependent(:destroy) }

  # Test validations
  it { should validate_presence_of(:username) }
  it { should validate_uniqueness_of(:username) }
  it { should validate_length_of(:username).is_at_least(3) }

  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email).ignoring_case_sensitivity }
  it { should allow_value('test@example.com').for(:email) }
  it { should_not allow_value('invalid-email').for(:email) }

  it { should have_secure_password }
  it { should validate_presence_of(:password).on(:create) }
  it { should validate_length_of(:password).is_at_least(6).on(:create) }
end
