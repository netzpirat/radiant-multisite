require File.dirname(__FILE__) + "/../../spec_helper"

describe Radiant::Extension do

  it "should be a Simpleton" do
    Radiant::Extension.included_modules.should include(Simpleton)
    Radiant::Extension.should respond_to(:instance)
  end
  
  it "should annotate version, description, url, root and extension_name" do
    Radiant::Extension.included_modules.should include(Annotatable)
    %w{version description url root extension_name}.each do |attribute|
      Radiant::Extension.should respond_to(attribute)
    end
  end
  
  it "should have access to the Radiant::AdminUI instance" do
    BasicExtension.instance.should respond_to(:admin)
    BasicExtension.admin.should == Radiant::AdminUI.instance
  end
  
  it "should have a migrator" do
    BasicExtension.instance.should respond_to(:migrator)
    BasicExtension.migrator.superclass.should == Radiant::ExtensionMigrator
  end
  
  it "should have a migrations path" do
    BasicExtension.migrations_path.should == "#{RADIANT_ROOT}/test/fixtures/extensions/01_basic/db/migrate"
  end
  
  it "should set the extension_name in subclasses" do
    Kernel.module_eval { class SuperExtension < Radiant::Extension; end }
    SuperExtension.extension_name.should == "Super"
  end
  
  it "should store route definitions defined in a block" do
    Radiant::Extension.should respond_to(:define_routes)
    my_block = proc {|map| map.stuff "stuff", :controller => "admin/pages" }
    Radiant::Extension.define_routes(&my_block)
    Radiant::Extension.route_definitions.should be_instance_of(Array)
    Radiant::Extension.route_definitions.first.should == my_block
  end

end

describe Radiant::Extension, "when inactive" do

  before :each do
    BasicExtension.deactivate
    Radiant::AdminUI.tabs.clear
  end

  it "should become active when activated" do
    BasicExtension.activate
    BasicExtension.active?.should == true
  end
  
end

describe Radiant::Extension, "when active" do

  it "should become deactive when deactivated" do
    BasicExtension.deactivate
    BasicExtension.active?.should == false
  end

  # This example needs revisiting and more detail
  it "should have loaded plugins stored in vendor/plugins" do
    defined?(Multiple).should_not be_nil
    defined?(NormalPlugin).should_not be_nil
  end
  
end
