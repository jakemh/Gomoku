class AddWinChainToGame < ActiveRecord::Migration
  def change
    add_column :games, :win_chain_array, :text
  end
end
