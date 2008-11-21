# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 21) do

  create_table "assets", :force => true do |t|
    t.string   "caption"
    t.string   "title"
    t.string   "asset_file_name"
    t.string   "asset_content_type"
    t.integer  "asset_file_size"
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "site_id"
  end

  create_table "config", :force => true do |t|
    t.string "key",   :limit => 40, :default => "", :null => false
    t.string "value",               :default => ""
  end

  add_index "config", ["key"], :name => "key", :unique => true

  create_table "extension_meta", :force => true do |t|
    t.string  "name"
    t.integer "schema_version", :default => 0
    t.boolean "enabled",        :default => true
  end

  create_table "galleries", :force => true do |t|
    t.string   "name"
    t.string   "slug"
    t.string   "path"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "hidden",         :default => false, :null => false
    t.integer  "parent_id"
    t.boolean  "external",       :default => false
    t.integer  "children_count", :default => 0,     :null => false
    t.integer  "created_by"
    t.integer  "updated_by"
    t.integer  "position"
  end

  create_table "gallery_importings", :force => true do |t|
    t.integer  "gallery_id"
    t.string   "path"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "gallery_item_infos", :force => true do |t|
    t.integer  "gallery_item_id"
    t.string   "name"
    t.string   "value_string"
    t.text     "value_text"
    t.integer  "value_integer"
    t.datetime "value_datetime"
  end

  create_table "gallery_items", :force => true do |t|
    t.string   "filename"
    t.string   "content_type"
    t.text     "description"
    t.integer  "gallery_id"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "extension"
    t.integer  "size"
    t.integer  "height"
    t.integer  "width"
    t.integer  "parent_id"
    t.string   "thumbnail"
    t.integer  "created_by"
    t.integer  "updated_by"
  end

  create_table "layouts", :force => true do |t|
    t.string   "name",          :limit => 100
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.string   "content_type",  :limit => 40
    t.integer  "lock_version",                 :default => 0
  end

  create_table "meta_tags", :force => true do |t|
    t.string "name", :null => false
  end

  add_index "meta_tags", ["name"], :name => "index_meta_tags_on_name", :unique => true

  create_table "page_attachments", :force => true do |t|
    t.integer "asset_id"
    t.integer "page_id"
    t.integer "position"
  end

  create_table "page_parts", :force => true do |t|
    t.string  "name",      :limit => 100
    t.string  "filter_id", :limit => 25
    t.text    "content"
    t.integer "page_id"
  end

  create_table "pages", :force => true do |t|
    t.string   "title"
    t.string   "slug",          :limit => 100
    t.string   "breadcrumb",    :limit => 160
    t.string   "class_name",    :limit => 25
    t.integer  "status_id",                    :default => 1,     :null => false
    t.integer  "parent_id"
    t.integer  "layout_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "published_at"
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.boolean  "virtual",                      :default => false, :null => false
    t.integer  "lock_version",                 :default => 0
    t.string   "description"
    t.string   "keywords"
  end

  create_table "part_types", :force => true do |t|
    t.string "name"
    t.string "field_type"
    t.string "field_class"
    t.string "field_styles"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id"
    t.text     "data"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "sites", :force => true do |t|
    t.string  "name"
    t.string  "domain"
    t.integer "homepage_id"
    t.integer "position",    :default => 0
    t.string  "base_domain"
  end

  create_table "snippets", :force => true do |t|
    t.string   "name",          :limit => 100, :default => "", :null => false
    t.string   "filter_id",     :limit => 25
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.integer  "lock_version",                 :default => 0
  end

  add_index "snippets", ["name"], :name => "name", :unique => true

  create_table "taggings", :force => true do |t|
    t.integer "meta_tag_id",   :null => false
    t.integer "taggable_id",   :null => false
    t.string  "taggable_type", :null => false
  end

  add_index "taggings", ["meta_tag_id", "taggable_id", "taggable_type"], :name => "index_taggings_on_meta_tag_id_and_taggable_id_and_taggable_type", :unique => true

  create_table "template_parts", :force => true do |t|
    t.integer "template_id"
    t.string  "name"
    t.string  "filter_id"
    t.integer "part_type_id"
    t.string  "description"
  end

  add_index "template_parts", ["template_id"], :name => "template_parts_on_template_id"

  create_table "templates", :force => true do |t|
    t.string  "name"
    t.text    "content"
    t.integer "layout_id"
    t.integer "position"
    t.string  "page_class_name"
  end

  add_index "templates", ["name"], :name => "index_templates_on_name"
  add_index "templates", ["position"], :name => "index_templates_on_position"

  create_table "users", :force => true do |t|
    t.string   "name",          :limit => 100
    t.string   "email"
    t.string   "login",         :limit => 40,  :default => "",    :null => false
    t.string   "password",      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.boolean  "admin",                        :default => false, :null => false
    t.boolean  "developer",                    :default => false, :null => false
    t.text     "notes"
    t.integer  "lock_version",                 :default => 0
    t.string   "salt"
    t.string   "session_token"
  end

  add_index "users", ["login"], :name => "login", :unique => true

end
