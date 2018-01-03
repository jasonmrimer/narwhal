Rails.application.routes.draw do

  namespace :admin do
    resources :airmen
    resources :certifications
    resources :qualifications
    resources :sites
    resources :units

  end
  root to: "admin/airmen#index"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
