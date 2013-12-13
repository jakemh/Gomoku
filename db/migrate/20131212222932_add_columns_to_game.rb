class AddColumnsToGame < ActiveRecord::Migration
  def change
    add_column :games, :white_score, :integer
    add_column :games, :status, :string
  end
end
