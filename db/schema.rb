# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_24_211253) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "participants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "surname", null: false
    t.string "email", null: false
    t.uuid "retrospective_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["retrospective_id"], name: "index_participants_on_retrospective_id"
  end

  create_table "reactions", force: :cascade do |t|
    t.uuid "author_id", null: false
    t.string "target_type", null: false
    t.bigint "target_id", null: false
    t.string "kind", default: "vote", null: false
    t.string "content", null: false
  end

  create_table "reflections", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "zone_id_id"
    t.uuid "owner_id", null: false
    t.bigint "topic_id"
    t.integer "position_in_zone", default: 1, null: false
    t.integer "position_in_topic", default: 1, null: false
    t.index ["zone_id_id"], name: "index_reflections_on_zone_id_id"
  end

  create_table "retrospectives", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "kind", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "tasks", force: :cascade do |t|
    t.uuid "author_id", null: false
    t.uuid "assignee_id", null: false
    t.text "title", null: false
    t.text "description"
    t.string "status", default: "todo", null: false
  end

  create_table "topics", force: :cascade do |t|
    t.string "label", null: false
  end

  create_table "zones", force: :cascade do |t|
    t.string "identifier", null: false
    t.uuid "retrospective_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["retrospective_id"], name: "index_zones_on_retrospective_id"
  end

end
