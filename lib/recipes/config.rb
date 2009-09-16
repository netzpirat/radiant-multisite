require 'erb'

before "deploy:setup", "config:db"
before "deploy:setup", "config:newrelic"
before "deploy:setup", "config:exceptional"

after "deploy:update_code", "config:db:symlink"
after "deploy:update_code", "config:newrelic:symlink"
after "deploy:update_code", "config:exceptional:symlink"

namespace :config do
  
  namespace :db do
    desc "Create database yaml in capistrano shared path"
    task :default do
      db_config = ERB.new <<-EOF
      base: &base
        adapter: mysql
        host: localhost
        username: #{application}
        password: 

      development:
        database: #{application}_development
        <<: *base

      test:
        database: #{application}_test
        <<: *base

      production:
        database: #{application}_production
        <<: *base
      EOF

      run "mkdir -p #{shared_path}/config"
      put db_config.result, "#{shared_path}/config/database.yml"
      logger.important "Please configure your database credentials in #{shared_path}/config/database.yml"
    end

    desc "Make symlink for shared database yaml"
    task :symlink do
      run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
    end
  end

  namespace :exceptional do
    desc "Create exceptional yaml in capistrano shared path"
    task :default do
      exceptional_config = ERB.new <<-EOF
      # here are the settings that are common to all environments
      common: &default_settings
        # You must specify your Exceptional API key here.
        api-key: 
        # Exceptional creates a separate log file from your application's logs
        # available levels are debug, info, warn, error, fatal
        log-level: info
        # The exceptional agent sends data via regular http by default
        # Setting this value to true will send data over SSL, increasing security
        # There will be an additional CPU overhead in encrypting the data, however
        # as long as your deployment environment is not Passenger (mod_rails), this
        # happens in the background so as not to incur a page wait for your users.
        ssl: false

      development:
        <<: *default_settings
        # Normally no reason to collect exceptions in development
        # NOTE: for trial purposes you may want to enable exceptional in development
        enabled: false

      test:
        <<: *default_settings
        # No reason to collect exceptions when running tests by default
        enabled: false

      production:
        <<: *default_settings
        enabled: true

      staging:
        # It's common development practice to have a staging environment that closely
        # mirrors production, by default catch errors in this environment too.
        <<: *default_settings
        enabled: true

      EOF

      run "mkdir -p #{shared_path}/config"
      put exceptional_config.result, "#{shared_path}/config/exceptional.yml"
      logger.important "Please add your excpetional api key in #{shared_path}/config/exceptional.yml"
    end

    desc "Make symlink for shared exceptional yaml"
    task :symlink do
      run "ln -nfs #{shared_path}/config/exceptional.yml #{release_path}/config/exceptional.yml"
    end
  end

  namespace :newrelic do
    desc "Create newrelic yaml in capistrano shared path"
    task :default do
      newrelic_config = ERB.new <<-EOF
      #
      # This file configures the NewRelic RPM Agent, NewRelic RPM monitors Rails 
      # applications with deep visibility and low overhead.  For more information, 
      # visit www.newrelic.com.
      #
      # This configuration file is custom generated for netzpirat
      #
      # here are the settings that are common to all environments
      common: &default_settings
        # ============================== LICENSE KEY ===============================
        # You must specify the licence key associated with your New Relic account.
        # This key binds your Agent's data to your account in the New Relic RPM service.
        license_key: ''

        # Application Name
        # For Passenger, JRuby, and Litespeed, if you host multiple applications on a
        # single host, then define an application name for each app. If you don't do
        # this, then all instances reporting from a host have their data aggregated.
        # app_name: <your app name>

        # the 'enabled' setting is used to turn on the NewRelic Agent.  When false,
        # your application is not instrumented and the Agent does not start up or
        # collect any data; it is a complete shut-off.
        #
        # when turned on, the agent collects performance data by inserting lightweight
        # tracers on key methods inside the rails framework and asynchronously aggregating
        # and reporting this performance data to the NewRelic RPM service at NewRelic.com.
        # below.
        enabled: false

        # The newrelic agent generates its own log file to keep its logging information
        # separate from that of your application.  Specify its log level here.
        log_level: info

        # The newrelic agent communicates with the RPM service via http by default.
        # If you want to communicate via https to increase security, then turn on
        # SSL by setting this value to true.  Note, this will result in increased
        # CPU overhead to perform the encryption involved in SSL communication, but this
        # work is done asynchronously to the threads that process your application code, so
        # it should not impact response times.
        ssl: false


        # Proxy settings for connecting to the RPM server.
        #
        # If a proxy is used, the host setting is required.  Other settings are optional.  Default
        # port is 8080.
        #
        # proxy_host: proxy.sample.com
        # proxy_port: 8080
        # proxy_user:
        # proxy_pass:


        # Tells transaction tracer and error collector (when enabled) whether or not to capture HTTP params. 
        # When true, the RoR filter_parameters mechanism is used so that sensitive parameters are not recorded
        capture_params: false


        # Transaction tracer captures deep information about slow
        # transactions and sends this to the RPM service once a minute. Included in the
        # transaction is the exact call sequence of the transactions including any SQL statements
        # issued.
        transaction_tracer:

          # Transaction tracer is enabled by default. Set this to false to turn it off. This feature
          # is only available at the Silver and above product levels.
          enabled: true


          # When transaction tracer is on, SQL statements can optionally be recorded. The recorder
          # has three modes, "off" which sends no SQL, "raw" which sends the SQL statement in its 
          # original form, and "obfuscated", which strips out numeric and string literals
          record_sql: obfuscated

          # Threshold in seconds for when to collect stack trace for a SQL call. In other words, 
          # when SQL statements exceed this threshold, then capture and send to RPM the current
          # stack trace. This is helpful for pinpointing where long SQL calls originate from  
          stack_trace_threshold: 0.500

        # Error collector captures information about uncaught exceptions and sends them to RPM for
        # viewing
        error_collector:

          # Error collector is enabled by default. Set this to false to turn it off. This feature
          # is only available at the Silver and above product levels
          enabled: true

          # Tells error collector whether or not to capture a source snippet around the place of the
          # error when errors are View related.
          capture_source: true    

          # To stop specific errors from reporting to RPM, set this property to comma separated 
          # values
          #
          #ignore_errors: ActionController::RoutingError, ...


      # override default settings based on your application's environment

      # NOTE if your application has other named environments, you should
      # provide newrelic conifguration settings for these enviromnents here.

      development:
        <<: *default_settings
        # turn off communication to RPM service in development mode.
        # NOTE: for initial evaluation purposes, you may want to temporarily turn
        # the agent on in development mode.
        enabled: false

        # When running in Developer Mode, the New Relic Agent will present 
        # performance information on the last 100 transactions you have 
        # executed since starting the mongrel.  to view this data, go to 
        # http://localhost:3000/newrelic
        developer: true

      test:
        <<: *default_settings
        # it almost never makes sense to turn on the agent when running unit, functional or
        # integration tests or the like.
        enabled: false

      # Turn on the agent in production for 24x7 monitoring.  NewRelic testing shows
      # an average performance impact of < 5 ms per transaction, you you can leave this on
      # all the time without incurring any user-visible performance degredation.
      production:
        <<: *default_settings
        enabled: true

      # many applications have a staging environment which behaves identically to production.
      # Support for that environment is provided here.  By default, the staging environment has
      # the agent turned on.
      staging:
        <<: *default_settings
        enabled: true
      EOF

      run "mkdir -p #{shared_path}/config"
      put newrelic_config.result, "#{shared_path}/config/newrelic.yml"
      logger.important "Please add your newrelic api key in #{shared_path}/config/newrelic.yml"
    end

    desc "Make symlink for shared newrelic yaml"
    task :symlink do
      run "ln -nfs #{shared_path}/config/newrelic.yml #{release_path}/config/newrelic.yml"
    end
  end    
end
