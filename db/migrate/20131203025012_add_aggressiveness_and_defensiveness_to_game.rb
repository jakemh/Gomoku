class AddAggressivenessAndDefensivenessToGame < ActiveRecord::Migration
  def change
    add_column :games, :aggressiveness, :integer
    add_column :games, :defensiveness, :integer
  end
end
