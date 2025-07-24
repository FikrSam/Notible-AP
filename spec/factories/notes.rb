# spec/factories/notes.rb
FactoryBot.define do
  factory :note do
    title { Faker::Lorem.sentence }
    content { Faker::Lorem.paragraph }
    tags { 'work,ideas' }
    user # This association will automatically create a user
  end
end
