namespace :apache do
  namespace :passenger do
    desc "start Apache and Passenger"
    task :start, :roles => :app, :except => { :no_release => true } do
      as = fetch(:runner, "app")
      invoke_command "#{apache_init_script} start", :via => run_method, :as => as
    end

    desc "stop Apache and Passenger"
    task :stop, :roles => :app, :except => { :no_release => true } do
      as = fetch(:runner, "app")
      invoke_command "#{apache_init_script} stop", :via => run_method, :as => as
    end

    desc "restart Passenger"
    task :restart, :roles => :app, :except => { :no_release => true } do
      as = fetch(:runner, "app")
      restart_file = fetch(:passenger_restart_file, "#{deploy_to}/current/tmp/restart.txt")
      invoke_command "touch #{restart_file}", :via => run_method, :as => as
    end
  end
end

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    apache.passenger.restart
  end

  task :start, :roles => :app, :except => { :no_release => true } do
    apache.passenger.start
  end

  task :stop, :roles => :app, :except => { :no_release => true } do
    apache.passenger.stop
  end
end