Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :retrospectives, only: %i(new create show) do
    resources :reflections, only: %i(create update destroy) do
      resources :reactions, only: %i(create destroy)
    end
    resources :participants, only: %i(create update)
    resources :tasks, only: %i(create update destroy)
  end

  resource :sessions, only: %i(new create)
  resource :accounts, only: %i(create)

  get '/auth/:provider/callback' => 'sessions#omniauth'

  get '/', to: 'static#dashboard', as: :dashboard
end
