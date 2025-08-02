# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    username { Faker::Internet.username(specifier: 3..20) }
    email { Faker::Internet.email }
    password { 'password123' }
    password_confirmation { 'password123' }
  end
end
