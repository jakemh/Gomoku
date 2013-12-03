class ChangeStringToTextInGame2 < ActiveRecord::Migration
  def change
  	change_column :games, :board, :text, :limit => nil
  end
end
