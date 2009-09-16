# ================================================================
# COMMON DEPLOYMENT OPTIONS
# ================================================================

set :stages, %w(production)
require 'capistrano/ext/multistage'
require 'capistrano/deepmodules'

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
set :git_enable_submodules, 1
set :deploy_via, :remote_cache

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
