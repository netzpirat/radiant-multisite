require File.dirname(__FILE__) + '/../spec_helper'

# http://blog.davidchelimsky.net/articles/2007/06/03/oxymoron-testing-behaviour-of-abstractions
describe ApplicationController do
  dataset :users

  it 'should include LoginSystem' do
    ApplicationController.included_modules.should include(LoginSystem)
  end

  it 'should initialize config' do
    controller.config.should == Radiant::Config
  end

  it "should initialze the cache" do
    controller.cache.should == ResponseCache.instance
  end

  it 'should set the current user for the UserActionObserver' do
    ApplicationController.filter_chain.find(:set_current_user).should_not be_nil
    UserActionObserver.current_user = nil
    controller.should_receive(:current_user).and_return(users(:admin))
    controller.send :set_current_user
    UserActionObserver.current_user.should == users(:admin)
  end

  it 'should initialize the javascript and stylesheets arrays' do
    ApplicationController.filter_chain.find(:set_javascripts_and_stylesheets).should_not be_nil
    controller.send :set_javascripts_and_stylesheets
    controller.send(:instance_variable_get, :@javascripts).should_not be_nil
    controller.send(:instance_variable_get, :@javascripts).should be_instance_of(Array)
    controller.send(:instance_variable_get, :@stylesheets).should_not be_nil
    controller.send(:instance_variable_get, :@stylesheets).should be_instance_of(Array)
  end

  it "should include stylesheets" do
    controller.send :set_javascripts_and_stylesheets
    controller.include_stylesheet('test').should include('test')
  end

  it "should include javascripts" do
    controller.send :set_javascripts_and_stylesheets
    controller.include_javascript('test').should include('test')
  end
end
