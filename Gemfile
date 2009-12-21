clear_sources
disable_system_gems
source 'http://gemcutter.org'
source 'http://gems.github.com'

bundle_path 'gems'

gem 'radiant', '0.8.1'
gem 'mysql'
gem 'unicode'
gem 'mime-types'
gem 'imagesize'
gem 'newrelic_rpm'
gem 'sanitize'
gem 'fastercsv'
gem 'will_paginate'
gem 'exceptional'

except :production do
  gem 'mongrel'
  gem 'rack-bug'
  gem 'cucumber', '0.3.9'
  gem 'rspec-rails', '1.2.6'
  gem 'webrat', '0.4.4'
  gem 'capistrano'
  gem 'capistrano-ext'
  gem 'morhekil-capistrano-deepmodules'
  gem 'rake'
end
