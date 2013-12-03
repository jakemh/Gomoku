class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :game_id
      t.integer :rows
      t.string :board
      t.integer :current_player
      t.string :p2_moves
      t.integer :moves_considered
      t.ingeger :depth
      t.string :temp_data
      t.ingeger :win_chain
      t.timestamps
    end
  end
end
