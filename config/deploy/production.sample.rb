# ================================================================
# PRODUCTION SERVER
# ================================================================

set :deploy_to, "/var/www/www.youserver.ch"
set :use_sudo, false

role :web, "www.youserver.ch"
role :app, "www.youserver.ch"
role :db,  "www.youserver.ch", :primary => true
