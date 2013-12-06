class AddBackupMoveColumnToGame < ActiveRecord::Migration
  def change
    add_column :games, :backup_move, :string
  end
end
