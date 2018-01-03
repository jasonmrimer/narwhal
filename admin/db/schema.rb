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

ActiveRecord::Schema.define(version: 20180102221647) do

  create_table "airman", id: :integer, default: nil, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "first_name", limit: 64, null: false
    t.string "last_name", limit: 64, null: false
    t.integer "unit_id"
    t.index ["unit_id"], name: "unit_id"
  end

  create_table "airmen", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "firstName"
    t.string "lastName"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "certification", id: :integer, default: nil, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "title", limit: 64, null: false
  end

  create_table "join_airman_certification", primary_key: ["airman_id", "certification_id"], force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "airman_id", null: false
    t.integer "certification_id", null: false
    t.date "expiration_date"
    t.index ["certification_id"], name: "certification_id"
  end

  create_table "join_airman_qualification", primary_key: ["airman_id", "qualification_id"], force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "airman_id", null: false
    t.integer "qualification_id", null: false
    t.date "expiration_date"
    t.index ["qualification_id"], name: "qualification_id"
  end

  create_table "mission", primary_key: "mission_id", id: :string, limit: 64, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "ato_mission_number", limit: 64
    t.datetime "start_date_time"
    t.datetime "end_date_time"
    t.integer "site_id"
    t.index ["site_id"], name: "site_id"
  end

  create_table "qualification", id: :integer, default: nil, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "acronym", limit: 64, null: false
    t.string "title", limit: 64, null: false
  end

  create_table "schema_version", primary_key: "version", id: :string, limit: 50, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "version_rank", null: false
    t.integer "installed_rank", null: false
    t.string "description", limit: 200, null: false
    t.string "type", limit: 20, null: false
    t.string "script", limit: 1000, null: false
    t.integer "checksum"
    t.string "installed_by", limit: 100, null: false
    t.timestamp "installed_on", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.integer "execution_time", null: false
    t.boolean "success", null: false
    t.index ["installed_rank"], name: "schema_version_ir_idx"
    t.index ["success"], name: "schema_version_s_idx"
    t.index ["version_rank"], name: "schema_version_vr_idx"
  end

  create_table "site", id: :integer, default: nil, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name", limit: 64, null: false
    t.index ["name"], name: "unique_site_name", unique: true
  end

  create_table "unit", id: :integer, default: nil, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name", limit: 64, null: false
  end

  add_foreign_key "airman", "unit", name: "airman_ibfk_1"
  add_foreign_key "join_airman_certification", "airman", name: "join_airman_certification_ibfk_1"
  add_foreign_key "join_airman_certification", "certification", name: "join_airman_certification_ibfk_2"
  add_foreign_key "join_airman_qualification", "airman", name: "join_airman_qualification_ibfk_1"
  add_foreign_key "join_airman_qualification", "qualification", name: "join_airman_qualification_ibfk_2"
  add_foreign_key "mission", "site", name: "mission_ibfk_1"
end
