Rails.application.routes.draw do
  resources :shows, except: [:show] do
    member do
      post :like
      post :dislike
    end

    collection do
      get :liked
      get :disliked
    end
  end
end
