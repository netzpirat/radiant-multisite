module ApplicationHelper
  include LocalTime
  include Admin::RegionsHelper
  
  def config
    Radiant::Config
  end
  
  def default_page_title
    title + ' - ' + subtitle
  end
  
  def title
    config['admin.title'] || 'Radiant CMS'
  end
  
  def subtitle
    config['admin.subtitle'] || 'Publishing for Small Teams'
  end
  
  def logged_in?
    !current_user.nil?
  end
  
  def save_model_button(model)
    label = if model.new_record?
      "Create #{model.class.name}"
    else
      'Save Changes'
    end
    submit_tag label, :class => 'button'
  end
  
  def save_model_and_continue_editing_button(model)
    submit_tag 'Save and Continue Editing', :name => 'continue', :class => 'button'
  end
  
  # Redefine pluralize() so that it doesn't put the count at the beginning of
  # the string.
  def pluralize(count, singular, plural = nil)
    if count == 1
      singular
    elsif plural
      plural
    else
      ActiveSupport::Inflector.pluralize(singular)
    end
  end
  
  def links_for_navigation
    tabs = admin.tabs
    links = tabs.map do |tab|
      nav_link_to(tab.name, File.join(request.relative_url_root, tab.url)) if tab.shown_for?(current_user)
    end.compact
    links.join(separator)
  end
  
  def separator
    %{ <span class="separator"> | </span> }
  end
  
  def current_url?(options)
    url = case options
    when Hash
      url_for options
    else
      options.to_s
    end
    request.request_uri =~ Regexp.new('^' + Regexp.quote(clean(url)))
  end
  
  def clean(url)
    uri = URI.parse(url)
    uri.path.gsub(%r{/+}, '/').gsub(%r{/$}, '')
  end
  
  def nav_link_to(name, options)
    if current_url?(options)
      %{<strong>#{ link_to name, options }</strong>}
    else
      link_to name, options
    end
  end
  
  def admin?
    current_user and current_user.admin?
  end
  
  def developer?
    current_user and (current_user.developer? or current_user.admin?)
  end
  
  def focus(field_name)
    javascript_tag "Field.activate('#{field_name}');"
  end
  
  def updated_stamp(model)
    unless model.new_record?
      updated_by = (model.updated_by || model.created_by)
      login = updated_by ? updated_by.login : nil
      time = (model.updated_at || model.created_at)
      if login or time
        html = %{<p style="clear: left"><small>Last updated } 
        html << %{by #{login} } if login
        html << %{at #{ timestamp(time) }} if time
        html << %{</small></p>}
        html
      end
    else
      %{<p class="clear">&nbsp;</p>}
    end
  end

  def timestamp(time)
    adjust_time(time).strftime("%I:%M <small>%p</small> on %B %d, %Y")     
  end 
  
  def meta_visible(symbol)
    v = case symbol
    when :meta_more
      not meta_errors?
    when :meta, :meta_less
      meta_errors?
    end
    v ? {} : {:style => "display:none"}
  end
  
  def meta_errors?
    false
  end
  
  def toggle_javascript_for(id)
    "Element.toggle('#{id}'); Element.toggle('more-#{id}'); Element.toggle('less-#{id}');"
  end
  
  def image(name, options = {})
    image_tag(append_image_extension("admin/#{name}"), options)
  end
  
  def image_submit(name, options = {})
    image_submit_tag(append_image_extension("admin/#{name}"), options)
  end
  
  def admin
    Radiant::AdminUI.instance
  end
  
  def filter_options_for_select(selected=nil)
    options_for_select([['<none>', '']] + TextFilter.descendants.map { |s| s.filter_name }.sort, selected)
  end
  
  private
  
    def append_image_extension(name)
      unless name =~ /\.(.*?)$/
        name + '.png'
      else
        name
      end
    end
  
end
