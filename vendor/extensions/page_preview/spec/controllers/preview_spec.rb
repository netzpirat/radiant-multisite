require File.dirname(__FILE__) + '/../spec_helper'

describe Admin::PageController, "routes preview page requests" do
  scenario :pages
  
  it "route a preview page correctly" do
    route_for(preview_page_path).should_equal "/admin/preview"
  end
  
end
