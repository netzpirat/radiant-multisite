after "deploy:update_code", "deploy:gems:unpack"

namespace :deploy do
  namespace :gems do
    desc "Unpack bundled gems"
    task :unpack do
      run "cd #{current_path} && gem bundle"
    end
  end

end