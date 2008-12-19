module Admin::RegionsHelper
  def render_region(region, options={}, &block)
    lazy_initialize_region_set    
    default_partials = Radiant::AdminUI::RegionPartials.new(@template)
    if block_given?
      junk = capture(default_partials, &block) 
      (options[:locals] ||= {}).merge!(:defaults => default_partials)
    end
    output = @region_set[region].compact.map do |partial|
      begin
        render options.merge(:partial => partial)
      rescue ::ActionView::TemplateError => e # error in template
        raise e
      rescue ::ActionView::ActionViewError # couldn't find template
        default_partials[partial]
      end
    end.join
    block_given? ? concat(output, block.binding) : output
  end
  
  def lazy_initialize_region_set
    unless @region_set
      @controller_name ||= @controller.controller_name
      @template_name ||= File.basename(@first_render).split(".").last
      @region_set = admin.send(@controller_name).send(@template_name)
    end
  end
end