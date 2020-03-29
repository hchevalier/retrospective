Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :retrospectives, only: %i(new create show)
  resources :participants, only: %i(create)
  root 'retrospectives#new'
end
