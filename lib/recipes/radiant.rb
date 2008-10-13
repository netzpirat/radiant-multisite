namespace :deploy do

  after "deploy:cold", "deploy:radiant:bootstrap"
  after "deploy:migrate", "deploy:radiant:migrate:extensions"

  desc "Overridden deploy:cold for Radiant."
  task :cold do
    update
    radiant::bootstrap
    start
  end
  
  namespace :radiant do
    desc "Radiant Bootstrap with simple blog template and default values."
    task :bootstrap do
      rake = fetch(:rake, "rake")
      rails_env = fetch(:rails_env, "production")

      run "cd #{current_release}; #{rake} RAILS_ENV=#{rails_env} ADMIN_NAME=Administrator ADMIN_USERNAME=admin ADMIN_PASSWORD=radiant DATABASE_TEMPLATE=simple-blog.yml OVERWRITE=true db:bootstrap"
    end

    namespace :migrate do
      desc "Runs migrations on extensions."
      task :extensions do
        rake = fetch(:rake, "rake")
        rails_env = fetch(:rails_env, "production")
        run "cd #{current_release}; #{rake} RAILS_ENV=#{rails_env} db:migrate:extensions"
      end
    end  
    
  end
end
