# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131215091038) do

  create_table "games", force: true do |t|
    t.integer  "game_id"
    t.integer  "rows"
    t.text     "board"
    t.integer  "current_player"
    t.integer  "moves_considered"
    t.integer  "depth"
    t.integer  "win_chain"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "aggressiveness"
    t.integer  "defensiveness"
    t.string   "backup_move"
    t.integer  "time_limit"
    t.text     "temp_data"
    t.text     "p2_moves"
    t.integer  "white_score"
    t.string   "status"
    t.text     "win_chain_array"
    t.text     "p1_moves"
  end

end
