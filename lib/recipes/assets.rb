namespace :deploy do

  after "deploy:setup", "deploy:radiant:extensions:paperclipped:setup"
  after "deploy:symlink", "deploy:radiant:extensions:paperclipped:symlink"

  namespace :radiant do
    namespace :extensions do
      namespace :paperclipped do
        desc "Create the assets dir in shared path."
        task :setup do
          run "cd #{shared_path}; mkdir assets"
        end

        desc "Link assets from shared to common."
        task :symlink do
          run "cd #{current_path}/public; rm -rf assets; ln -s #{shared_path}/assets ."
        end

      end
    end
  end
end