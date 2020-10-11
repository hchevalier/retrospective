Rails.application.routes.draw do
  resources :retrospectives, only: %i(create) do
    resources :reflections, only: %i(create update destroy) do
      resources :reactions, only: %i(create destroy)
    end
    resources :topics, only: %i(create update) do
      resources :reactions, only: %i(create destroy)
    end
    resources :participants, only: %i(create update)
    resources :tasks, only: %i(destroy)
  end

  scope :api do
    resources :tasks, only: %i(index create update)
  end

  namespace :api do
    resource :account, only: %i(show)
    resources :group_accesses, only: %i(index destroy)
    resources :groups, only: %i(index create show) do
      resources :pending_invitations, only: %i(index create destroy)
    end
    resources :notices, only: :create
    resources :pending_invitations, only: %i(update)
    resources :retrospectives, only: %i(index show)
    resources :retrospective_kinds, only: :index
  end

  resource :sessions, only: %i(create)
  resources :password_reset, only: %i(create show update) # TODO: move #show to SPA
  resource :accounts, only: %i(create)

  get '/auth/:provider/callback' => 'sessions#omniauth'
  get '/logout', to: 'sessions#destroy', as: :logout
  get '/(*path)', to: 'static#single_page_app', as: :single_page_app
end
