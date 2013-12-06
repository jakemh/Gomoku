class AddTimeLimitColumnToGame < ActiveRecord::Migration
  def change
    add_column :games, :time_limit, :integer
  end
end
