Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :retrospectives, only: %i(new create show) do
    member do
      resources :reflections, only: %i(create update destroy) do
        member do
          resources :reactions, only: %i(create destroy)
        end
      end
      resources :participants, only: %i(create update)
    end
  end

  root 'retrospectives#new'
end
