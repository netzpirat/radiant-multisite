require 'vizres/browser'

module Vizres
  TMP = File.join(RAILS_ROOT, "public", "tmp")
  RESPONSE_TXT = File.join(TMP, "response.txt")
  RESPONSE_HTML = File.join(TMP, "response.html")
  RESPONSE_URI = "http://localhost:3000/tmp/response.html"

  def vr(format=:web)
    create_tmp_if_missing
    if format.is_a?(Symbol)
      case format
        when :web  then open_from_file(@response.body, RESPONSE_HTML, RESPONSE_URI)
        when :html then open_from_file(@response.body, RESPONSE_TXT)
      end
    else
      open_from_file(format, RESPONSE_HTML)
    end
  end

  def open_from_file(data, write_to, read_from=nil)
    File.open(write_to, File::CREAT|File::TRUNC|File::WRONLY) { |f| f << data }
    Browser.open(read_from || write_to)
  end

  def create_tmp_if_missing
    unless File.exists?(TMP)
      FileUtils.mkdir_p(TMP)
      `svn propset svn:ignore tmp #{RAILS_ROOT}/public` unless `which svn`.empty?
    end
  end
end

Test::Unit::TestCase.send(:include, Vizres)