# ================================================================
# RAILS
# ================================================================

set :rails_env, "production"
set :mod_rails_restart_file, "/var/www/radiant-multisite/current/tmp/restart.txt"

# ================================================================
# SERVERS
# ================================================================

set :deploy_to, "/var/www/radiant-multisite"
set :use_sudo, false

role :web, "www.radiant-multisite.org"
role :app, "www.radiant-multisite.org"
role :db,  "www.radiant-multisite.org", :primary => true
