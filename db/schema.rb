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

ActiveRecord::Schema.define(version: 20190518131259) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "account_favourites", force: :cascade do |t|
    t.integer "account_id"
    t.integer "item_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "quantity"
    t.index ["account_id"], name: "index_account_favourites_on_account_id"
    t.index ["item_id"], name: "index_account_favourites_on_item_id"
  end

  create_table "accounts", force: :cascade do |t|
    t.integer "event_id"
    t.string "name"
    t.string "contact_name"
    t.string "phone"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.boolean "is_active"
    t.index ["event_id"], name: "index_accounts_on_event_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.integer "show_order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "event_id"
    t.index ["show_order"], name: "index_categories_on_show_order"
  end

  create_table "events", force: :cascade do |t|
    t.string "provider", default: "name", null: false
    t.string "uid", default: "name", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "logo"
    t.string "email"
    t.boolean "admin", default: false
    t.boolean "active", default: false
    t.string "gst_number"
    t.string "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "default_station"
    t.string "icon"
    t.string "published_name"
    t.integer "station_id"
    t.string "item_image"
    t.string "help_url"
    t.string "event_help_url"
    t.boolean "show_date"
    t.index ["confirmation_token"], name: "index_events_on_confirmation_token", unique: true
    t.index ["name"], name: "index_events_on_name", unique: true
    t.index ["reset_password_token"], name: "index_events_on_reset_password_token", unique: true
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.decimal "price", precision: 8, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "order_no"
    t.boolean "active", default: true
    t.integer "category_id"
    t.integer "event_id"
    t.string "image"
    t.decimal "special_price", precision: 8, scale: 2
    t.index ["name"], name: "index_items_on_name"
    t.index ["order_no"], name: "index_items_on_order_no"
  end

  create_table "order_items", force: :cascade do |t|
    t.integer "quantity"
    t.decimal "value", precision: 8, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "order_id"
    t.string "notes", limit: 500
    t.integer "category_id"
    t.integer "item_id"
    t.index ["order_id"], name: "index_order_items_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.string "customer_name"
    t.string "station"
    t.decimal "value", precision: 8, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "station_id"
    t.boolean "charge_to_account", default: false
    t.datetime "scheduled_order_time"
    t.integer "event_id"
    t.integer "account_id"
    t.text "fulfilled"
    t.text "comments"
    t.integer "order_number"
    t.index ["order_number"], name: "index_orders_on_order_number"
    t.index ["station_id"], name: "index_orders_on_station_id"
  end

  create_table "stations", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "refresh_time", default: 60
    t.integer "next_station_id"
    t.integer "event_id"
    t.boolean "separate_by_category", default: false
    t.index ["name"], name: "index_stations_on_name"
    t.index ["next_station_id"], name: "index_stations_on_next_station_id"
  end

end
