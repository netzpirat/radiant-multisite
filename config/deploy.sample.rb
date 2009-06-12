# allocate a pty by default as some systems have problems without
default_run_options[:pty] = true

set :application, "radiant-multisite"

after "deploy", "deploy:cleanup"

# ================================================================
# SCM
# ================================================================

set :scm, "git"
set :repository,  "git://github.com/netzpirat/radiant-multisite.git"

set :branch, "master"
set :git_enable_submodules, 1    #comment for cap deploy:setup

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

role :web, "www.your-radiant-multisite.com"
role :app, "www.your-radiant-multisite.com"
role :db,  "www.your-radiant-multisite.com", :primary => true
