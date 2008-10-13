# Don't change this file!
# Configure your app in config/environment.rb and config/environments/*.rb

RAILS_ROOT = File.expand_path("#{File.dirname(__FILE__)}/..") unless defined?(RAILS_ROOT)

module Radiant
  class << self
    def boot!
      unless booted?
        pick_boot.run
      end
    end

    def booted?
      defined? Radiant::Initializer
    end

    def pick_boot
      case
      when app?
        AppBoot.new
      when vendor?
        VendorBoot.new
      else
        GemBoot.new
      end
    end

    def vendor?
      File.exist?("#{RAILS_ROOT}/vendor/radiant")
    end
    
    def app?
      File.exist?("#{RAILS_ROOT}/lib/radiant.rb")
    end
    
    def loaded_via_gem?
      pick_boot.is_a? GemBoot
    end
  end

  class Boot
    def run
      load_initializer
      Radiant::Initializer.run(:set_load_path)
    end
    
    def load_initializer
      begin
        require 'radiant'
        require 'radiant/initializer'
      rescue LoadError => e
        $stderr.puts %(Radiant could not be initialized. #{load_error_message})
        exit 1
      end
    end
  end

  class VendorBoot < Boot
    def load_initializer
      $LOAD_PATH.unshift "#{RAILS_ROOT}/vendor/radiant/lib" 
      super
    end
    
    def load_error_message
      "Please verify that vendor/radiant contains a complete copy of the Radiant sources."
    end
  end

  class AppBoot < Boot
    def load_initializer
      $LOAD_PATH.unshift "#{RAILS_ROOT}/lib" 
      super
    end
    
    def load_error_message
      "Please verify that you have a complete copy of the Radiant sources."
    end
  end

  class GemBoot < Boot
    def load_initializer
      self.class.load_rubygems
      load_radiant_gem
      super
    end

    def load_error_message
      "Please reinstall the Radiant gem with the command 'gem install radiant'."
    end

    def load_radiant_gem
      if version = self.class.gem_version
        gem 'radiant', version
      else
        gem 'radiant'
      end
    rescue Gem::LoadError => load_error
      $stderr.puts %(Missing the Radiant #{version} gem. Please `gem install -v=#{version} radiant`, update your RADIANT_GEM_VERSION setting in config/environment.rb for the Radiant version you do have installed, or comment out RADIANT_GEM_VERSION to use the latest version installed.)
      exit 1
    end

    class << self
      def rubygems_version
        Gem::RubyGemsVersion if defined? Gem::RubyGemsVersion
      end

      def gem_version
        if defined? RADIANT_GEM_VERSION
          RADIANT_GEM_VERSION
        elsif ENV.include?('RADIANT_GEM_VERSION')
          ENV['RADIANT_GEM_VERSION']
        else
          parse_gem_version(read_environment_rb)
        end
      end

      def load_rubygems
        require 'rubygems'

        unless rubygems_version >= '0.9.4'
          $stderr.puts %(Radiant requires RubyGems >= 0.9.4 (you have #{rubygems_version}). Please `gem update --system` and try again.)
          exit 1
        end

      rescue LoadError
        $stderr.puts %(Radiant requires RubyGems >= 0.9.4. Please install RubyGems and try again: http://rubygems.rubyforge.org)
        exit 1
      end

      def parse_gem_version(text)
        $1 if text =~ /^[^#]*RADIANT_GEM_VERSION\s*=\s*'([!~<>=]*\s*[\d.]+)'/
      end

      private
        def read_environment_rb
          File.read("#{RAILS_ROOT}/config/environment.rb")
        end
    end
  end
end

# All that for this:
Radiant.boot!
