require 'rubygems'
require 'plugit'

PLUGIT_ROOT = File.expand_path(File.dirname(__FILE__))

Plugit.describe do |dataset|
  dataset.environments_root_path = "#{PLUGIT_ROOT}/environments"
  vendor_directory               = "#{PLUGIT_ROOT}/../vendor/plugins"
  
  dataset.environment :default, 'Edge versions of Rails and RSpec' do |env|
    env.library :rails, :export => "git clone git://github.com/rails/rails.git" do |rails|
      rails.before_install { `git pull` }
      rails.load_paths = %w{/activesupport/lib /activerecord/lib /actionpack/lib}
      rails.requires = %w{active_support active_record active_record/fixtures action_controller action_view}
    end
    env.library :rspec, :export => "git clone git://github.com/dchelimsky/rspec.git" do |rspec|
      rspec.after_update { `git pull && mkdir -p #{vendor_directory} && ln -sF #{File.expand_path('.')} #{vendor_directory + '/rspec'}` }
      rspec.requires = %w{spec}
    end
  end
end