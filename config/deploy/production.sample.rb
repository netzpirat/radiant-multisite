# ================================================================
# PRODUCTION SERVER
# ================================================================

set :deploy_to, "/var/www/radiant-multisite"
set :use_sudo, false

role :web, "www.your-radiant-multisite.com"
role :app, "www.your-radiant-multisite.com"
role :db,  "www.your-radiant-multisite.com", :primary => true