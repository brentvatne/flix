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

ActiveRecord::Schema.define(version: 20141227162359) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "dislikes", force: :cascade do |t|
    t.integer "user_id"
    t.integer "show_id"
  end

  create_table "likes", force: :cascade do |t|
    t.integer "user_id"
    t.integer "show_id"
  end

  create_table "shows", force: :cascade do |t|
    t.text    "netflix_id"
    t.text    "genre"
    t.text    "cast"
    t.text    "title"
    t.text    "director"
    t.text    "description"
    t.integer "year"
    t.decimal "imdb_rating"
    t.text    "image_url"
    t.string  "region",           default: "canada"
    t.integer "trakt_id"
    t.text    "trakt_poster_url"
    t.hstore  "trakt_data"
    t.string  "colors",           default: [],       array: true
  end

  create_table "users", force: :cascade do |t|
    t.text "auth_id"
  end

end
