# allocate a pty by default as some systems have problems without
default_run_options[:pty] = true

set :application, "extranett"

# ================================================================
# SCM
# ================================================================

set :scm, "git"
set :repository,  "git@github.com:netzpirat/radiant-extranett.git"

set :branch, "master"
set :git_enable_submodules, 1

# ================================================================
# RAILS
# ================================================================

set :rails_env, "production"
set :mod_rails_restart_file, "/var/www/www.extranett.ch/current/tmp/restart.txt"

# ================================================================
# SERVERS
# ================================================================

set :deploy_to, "/var/www/www.extranett.ch"
set :deploy_via, :remote_cache

set :use_sudo, false

set :apache_init_script, "/etc/init.d/apache2"

role :web, "www.extranett.ch"
role :app, "www.extranett.ch"
role :db,  "www.extranett.ch", :primary => true
