# spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
  # Test associations
  it { should belong_to(:user) }

  # Test validations
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:content) }
end
