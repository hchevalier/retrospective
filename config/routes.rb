Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :retrospectives, only: %i(create show), id: /[a-zA-Z0-9\-]{36}/ do
    resources :reflections, only: %i(create update destroy) do
      resources :reactions, only: %i(create destroy)
    end
    resources :topics, only: %i(create update) do
      resources :reactions, only: %i(create destroy)
    end
    resources :participants, only: %i(create update)
    resources :tasks, only: %i(create update destroy)
  end

  scope :api do
    resources :retrospectives, only: :index
    resources :tasks, only: :index
    resources :groups, only: :index
    resources :retrospective_kinds, only: :index
  end

  resource :sessions, only: %i(new create)
  resources :password_reset, only: %i(create show update)
  resource :accounts, only: %i(create)

  get '/auth/:provider/callback' => 'sessions#omniauth'
  get '/logout', to: 'sessions#destroy', as: :logout
  get '/(*path)', to: 'static#single_page_app', as: :single_page_app
end
