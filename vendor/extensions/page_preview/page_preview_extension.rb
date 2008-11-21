require_dependency 'application'

class PagePreviewExtension < Radiant::Extension
  version "1.0"
  description "A page-preview functionality."
  url "http://github.com/brianjlandau/radiant_page_preview_extension"

  define_routes do |map|
    map.resources :preview, :path_prefix => 'admin', :controller => 'admin/preview'
    map.preview_page 'admin/preview', :controller => 'admin/preview', 
                                       :action => 'create',
                                       :conditions => { :method => :post }
  end
  
  def activate
    admin.page.edit.add :form_bottom, "preview_button", :before => 'edit_buttons'
  end
  
  def deactivate
  end

end