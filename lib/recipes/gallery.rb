namespace :deploy do

  after "deploy:setup", "deploy:radiant:extensions:gallery:setup"
  after "deploy:symlink", "deploy:radiant:extensions:gallery:symlink"
  after "deploy:cold", "deploy:radiant:extensions:gallery:install"
  
  namespace :radiant do
    namespace :extensions do
      namespace :gallery do
        desc "Create the galleries and attachments dirs in shared path."
        task :setup do
          run "cd #{shared_path}; mkdir galleries"
        end

        desc "Link galleries from shared to common."
        task :symlink do
          run "cd #{current_path}/public; rm -rf galleries; ln -s #{shared_path}/galleries ."
        end 
        
        desc "Migrates gallery and installs the public files."
        task :install do
          rake = fetch(:rake, "rake")
          rails_env = fetch(:rails_env, "production")

          run "cd #{current_release}; #{rake} RAILS_ENV=#{rails_env} radiant:extensions:gallery:install"
        end
      end
    end
  end
end
