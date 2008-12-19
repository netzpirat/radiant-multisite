require File.dirname(__FILE__) + "/../../spec_helper"

describe Admin::NodeHelper do

  before :each do
    @controller = mock("controller")
    @cookies = {}
    helper.stub!(:cookies).and_return(@cookies)
    helper.stub!(:homepage).and_return(nil)
    @page = mock_model(Page)
  end

  it "should render a sitemap node" do
    helper.should_receive(:render).with(:partial => "node", :locals => {:level => 0, :simple => false, :page => @page}).and_return(@current_node)
    helper.render_node(@page)
    helper.assigns[:current_node] == @page
  end

  it "should show all nodes when on the remove action" do
    assigns[:controller] = @controller
    @controller.should_receive(:action_name).and_return("remove")
    helper.show_all?.should be_true
  end

  it "should not show all nodes automatically when not in the remove action" do
    assigns[:controller] = @controller
    @controller.should_receive(:action_name).and_return("index")
    helper.show_all?.should be_false
  end

  it "should determine which rows to expand" do
    @cookies[:expanded_rows] = "1,2,3"
    helper.expanded_rows.should == [1,2,3]
  end

  it "should determine whether the current node should be expanded" do
    helper.should_receive(:show_all?).and_return(true)
    helper.expanded.should be_true
  end

  it "should determine the left padding for the current level" do
    helper.padding_left(0).should == 4
    helper.padding_left(1).should == 26
    helper.padding_left(2).should == 48
  end

  it "should determine the class of a parent node" do
    assigns[:current_node] = @page
    child = mock("child")
    @page.should_receive(:children).and_return([child])
    helper.should_receive(:expanded).and_return(true)
    helper.children_class.should == " children-visible"
  end

  it "should display an icon for the current node" do
    assigns[:current_node] = @page
    @page.should_receive(:virtual?).and_return(false)
    helper.should_receive(:image).with("page", :class => "icon", :alt => 'page-icon', :title => '')
    helper.icon
  end
  
  it "should display the virtual icon if the current node is virtual" do
    assigns[:current_node] = @page
    @page.should_receive(:virtual?).and_return(true)
    helper.should_receive(:image).with("virtual-page", :class => "icon", :alt => 'page-icon', :title => '')
    helper.icon
  end

  it "should render the title of the current node" do
    assigns[:current_node] = @page
    @page.should_receive(:title).and_return("Title")
    helper.node_title.should == %{<span class="title">Title</span>}
  end

  it "should render the page type if it's not Page" do
    assigns[:current_node] = @page
    @class = mock("Class")
    @page.should_receive(:class).and_return(@class)
    @class.should_receive(:display_name).and_return("Special")
    helper.page_type.should ==  %{<small class="info">(Special)</small>}
  end

  it "should not render the page type if it's Page" do
    assigns[:current_node] = @page
    @page.should_receive(:class).and_return(Page)
    helper.page_type.should ==  %{}
  end

  it "should render the busy spinner" do
    assigns[:current_node] = @page
    @page.should_receive(:id).and_return(1)
    helper.should_receive(:image).with('spinner.gif',
            :class => 'busy', :id => "busy-1",
            :alt => "",  :title => "",
            :style => 'display: none;')
    helper.spinner
  end

end