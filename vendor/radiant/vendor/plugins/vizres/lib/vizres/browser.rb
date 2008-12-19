module Vizres
  class Browser
    class << self
      
      def open(url)
        if macos?
          system("open #{url}")
        elsif windows?
          system("'C:\Program Files\Internet Explorer\IEXPLORE.EXE' #{url}")
        elsif linux?
          system("kfmclient openURL #{url}")
        else
          raise "Unrecognized OS. Browser can't be found."
        end
      end
      
      def host
        require 'rbconfig'
        Config::CONFIG['host']
      end
      
      def macos?
        host.include?('darwin')
      end
      
      def windows?
        host.include?('mswin')
      end
      
      def linux?
        host.include?('linux')
      end
      
    end
  end
end
