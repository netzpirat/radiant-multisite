$:.unshift(File.expand_path('./lib', ENV['rvm_path']))

# ================================================================
# COMMON DEPLOYMENT OPTIONS
# ================================================================

set :stages, %w(production)

require 'capistrano/ext/multistage'
require 'capistrano/deepmodules'
require 'bundler/capistrano'
require 'rvm/capistrano'

# allocate a pty by default as some systems have problems without
default_run_options[:pty] = true

set :application, "radiant-multisite"
set :rvm_ruby_string, 'ruby-1.8.7@radiant-multisite'

after "deploy", "deploy:cleanup"

# ================================================================
# SCM
# ================================================================

set :scm, "git"
set :repository,  "git://github.com/netzpirat/radiant-multisite.git"

set :branch, "master"
set :git_enable_submodules, 1
set :deploy_via, :remote_cache
