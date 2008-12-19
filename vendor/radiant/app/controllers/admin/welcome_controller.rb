class Admin::WelcomeController < ApplicationController
  no_login_required
  skip_before_filter :verify_authenticity_token
  
  def index
    redirect_to admin_pages_url
  end
  
  def login
    if request.post?
      login = params[:user][:login]
      password = params[:user][:password]
      announce_invalid_user unless self.current_user = User.authenticate(login, password)
    end
    if current_user
      if params[:remember_me]
        current_user.remember_me
        set_session_cookie
      end
      redirect_to (session[:return_to] || welcome_url)
      session[:return_to] = nil
    end
  end
  
  def logout
    cookies[:session_token] = { :expires => 1.day.ago }
    self.current_user.forget_me
    self.current_user = nil
    announce_logged_out
    redirect_to login_url
  end
  
  private
  
    def announce_logged_out
      flash[:notice] = 'You are now logged out.'
    end
    
    def announce_invalid_user
      flash[:error] = 'Invalid username or password.'
    end
    
end
