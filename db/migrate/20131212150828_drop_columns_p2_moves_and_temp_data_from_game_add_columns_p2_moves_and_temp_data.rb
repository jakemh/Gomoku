class DropColumnsP2MovesAndTempDataFromGameAddColumnsP2MovesAndTempData < ActiveRecord::Migration
  def change
  	remove_column :games, :p2_moves
  	remove_column :games, :temp_data

  	add_column :games, :temp_data, :text
  	add_column :games, :p2_moves, :text

  end
end
