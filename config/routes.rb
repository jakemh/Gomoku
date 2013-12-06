Gomoku::Application.routes.draw do
  resources :squares

  resources :boards
  resources :games

  put '/get_ai_move/' => 'games#send_ai_move', :as => :get_ai_move
  put '/get_ai_move_retry/' => 'games#send_ai_move_retry', :as => :get_ai_move_retryh
  post '/send_human_move/' => 'games#receive_human_move', :as => :human_move
   # post '/start_new_game/' => 'boards#start_new_game', :as => :start_new_game
  # put '/gate/:id/update' =>
  put '/games/:id/update' => 'games#update', :as => :update_game
  put '/games/:id/force_move' => 'games#force_move', :as => :force_move

end
