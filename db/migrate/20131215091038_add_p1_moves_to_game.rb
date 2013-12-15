class AddP1MovesToGame < ActiveRecord::Migration
  def change
    add_column :games, :p1_moves, :text
  end
end
