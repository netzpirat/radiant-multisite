namespace :deploy do

  after "deploy:setup", "deploy:radiant:extensions:gallery:setup"
  after "deploy:symlink", "deploy:radiant:extensions:gallery:symlink"

  namespace :radiant do
    namespace :extensions do
      namespace :gallery do
        desc "Create the galleries dir in shared path."
        task :setup do
          run "cd #{shared_path}; mkdir galleries"
        end

        desc "Link galleries from shared to common."
        task :symlink do
          run "cd #{current_path}/public; rm -rf galleries; ln -s #{shared_path}/galleries ."
        end

      end
    end
  end
end