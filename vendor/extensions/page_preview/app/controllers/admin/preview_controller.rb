class Admin::PreviewController < ApplicationController
  
  def create
    @page = page_class.new
    set_attributes
    if @page.valid? || (@page.errors.size == 1 && @page.errors.on(:slug) =~ /slug already in use/)
      begin
        Page.transaction do
          PagePart.transaction do
            @page.process(request, response)
            @performed_render = true
            raise "Render performed"
          end
        end
      rescue Exception => ex
        unless @performed_render
          render :update do |page|
            page.alert("Could not preview the page! #{ex.message}")
          end
        end
      end
    else
      render :update do |page|
        page.alert("Could not preview the page!\n\n\t-#{@page.errors.full_messages.join("\n\t-")}")
      end
    end
  end
  
  private
    def set_attributes
      @page.slug = params[:slug]
      if params[:page_preview] && params[:page_preview][:parent_id]
        @page.parent = Page.find_by_id(params[:page_preview][:parent_id].to_i)
      end
      @page.attributes = params[:page]
      set_times
      set_parts
    end
    
    def set_parts
      parts_to_update = {}
      (params[:part]||{}).each {|k,v| parts_to_update[v[:name]] = v }
      parts_to_update.values.each do |attrs|
        @page.parts.build(attrs)
      end
    end
    
    def set_times
      if params[:page_preview] && params[:page_preview][:page_id]
        if db_page = Page.find_by_id(params[:page_preview][:page_id])
          @page.created_at = db_page.created_at
          @page.published_at = db_page.published_at
        end
      end
      @page.created_at = Time.now if @page.created_at.blank?
      @page.published_at = Time.now if @page.published_at.blank?
      @page.updated_at = Time.now
    end
    
    def page_class
      classname = params[:page][:class_name].classify
      if Page.descendants.collect(&:name).include?(classname)
        classname.constantize
      else
        Page
      end
    end
    
end
