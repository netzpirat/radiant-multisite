require 'yaml'

namespace :sync do

  namespace :production do

    desc 'Sync database and filesystem from production to local'
    task :default do
      db and fs
    end

    desc "Sync database from production to local"
    task :db, :roles => :db, :only => { :primary => true } do

      database = YAML::load_file('config/database.yml')
      filename = "dump.#{Time.now.strftime '%Y-%m-%d_%H:%M:%S'}.sql"

      on_rollback { delete "/tmp/#{filename}" }

      run "mysqldump -u #{database['production']['username']} --password=#{database['production']['password']} #{database['production']['database']} > /tmp/#{filename}" do |channel, stream, data|
        puts data
      end

      download "/tmp/#{filename}", filename
      system "mysql -u #{database['development']['username']} --password=#{database['development']['password']} #{database['development']['database']} < #{filename}; rm -f #{filename}"
      
      logger.important "Sync database from production to local finished."
    end
      
    desc "Sync filesystem from production to local"
    task :fs, :roles => :web do
      database = YAML::load_file('config/database.yml')

      logger.info "Sync paperclipped assets..."
      system "rsync --archive --recursive --rsh=ssh --compress --human-readable #{database['production']['host']}:#{shared_path}/assets public/assets"

      logger.info "Sync galleries..."
      system "rsync --archive --recursive --rsh=ssh --compress --human-readable #{database['production']['host']}:#{shared_path}/galleries public/galleries"

      logger.important "Sync filesystem from production to local finished"
    end

  end

end
