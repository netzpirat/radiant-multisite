require 'test/unit'
require 'fileutils'

require 'rubygems'
require 'mocha'

RAILS_ROOT = '.'
require 'vizres'

class VizresTest < Test::Unit::TestCase
  
  # class Response
  #   attr_accessor :body
  # end
  # 
  # def test_foo
  #   response = Response.new
  #   response.body = "<html>FOO</html>"
  #   @response = response
  #   vr(:html)
  # end
  
  def setup
    @response = stub(:body => "<html></html>")
  end
  
  def test_vr
    self.expects(:create_tmp_if_missing)
    File.expects(:open).with(RESPONSE_HTML, File::CREAT|File::TRUNC|File::WRONLY)
    Browser.expects(:open).with("http://localhost:3000/tmp/response.html")
    vr
  end
  
  def test_vr_in_web
    self.expects(:create_tmp_if_missing)
    File.expects(:open).with(RESPONSE_HTML, File::CREAT|File::TRUNC|File::WRONLY)
    Browser.expects(:open).with("http://localhost:3000/tmp/response.html")
    vr(:web)
  end
  
  def test_vr_in_html
    self.expects(:create_tmp_if_missing)
    File.expects(:open).with(RESPONSE_TXT, File::CREAT|File::TRUNC|File::WRONLY)
    Browser.expects(:open).with("./public/tmp/response.txt")
    vr(:html)
  end
  
  def test_vr_with_raw_html
    self.expects(:create_tmp_if_missing)
    File.expects(:open).with(RESPONSE_HTML, File::CREAT|File::TRUNC|File::WRONLY)
    Browser.expects(:open).with("./public/tmp/response.html")
    vr("<html></html>")
  end
  
  def test_create_tmp_if_missing_when_tmp_does_not_exist
    File.expects(:exists?).with(TMP).returns(false)
    FileUtils.expects(:mkdir_p).with(TMP)
    self.expects(:`).with("which svn").returns("/opt/local/bin/svn")
    self.expects(:`).with("svn propset svn:ignore tmp ./public")
    create_tmp_if_missing
  end
  
  def test_create_tmp_if_missing_when_tmp_already_exists
    File.expects(:exists?).with(TMP).returns(true)
    FileUtils.expects(:mkdir).never
    create_tmp_if_missing
  end
  
  def test_create_tmp_if_missing_when_svn_is_not_available
    # TODO: write me
  end
  
end
