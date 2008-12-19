require 'test/unit'
require 'rubygems'
require 'mocha'

RAILS_ROOT = '.'
require 'vizres'

class BrowserTest < Test::Unit::TestCase
  
  def test_open_on_macos
    Browser.expects(:macos?).returns(true)
    Browser.expects(:system).with("open foo")
    Browser.open("foo")
  end
  
  def test_open_on_windows
    Browser.expects(:macos?).returns(false)
    Browser.expects(:windows?).returns(true)
    Browser.expects(:system).with("'C:\Program Files\Internet Explorer\IEXPLORE.EXE' foo")
    Browser.open("foo")
  end
  
  def test_open_on_windows
    Browser.expects(:macos?).returns(false)
    Browser.expects(:windows?).returns(false)
    Browser.expects(:linux?).returns(true)
    Browser.expects(:system).with("kfmclient openURL foo")
    Browser.open("foo")
  end
  
  def test_open_with_unrecognized_os
    Browser.expects(:macos?).returns(false)
    Browser.expects(:windows?).returns(false)
    Browser.expects(:linux?).returns(false)
    Browser.open("foo")
    flunk "Exception should have been thrown"
  rescue Exception => e
    assert_equal "Unrecognized OS. Browser can't be found.", e.message
  end
  
  def test_host
    Config::CONFIG.expects(:[]).with("host").returns("foo")
    assert_equal "foo", Browser.host
  end
  
  def test_macos?
    Browser.expects(:host).returns("darwin")
    assert Browser.macos?
  end
  
  def test_not_macos?
    Browser.expects(:host).returns("bogus")
    assert !Browser.macos?
  end
  
  def test_windows?
    Browser.expects(:host).returns("mswin")
    assert Browser.windows?
  end
  
  def test_not_windows?
    Browser.expects(:host).returns("bogus")
    assert !Browser.windows?
  end
  
  def test_linux?
    Browser.expects(:host).returns("linux")
    assert Browser.linux?
  end
  
  def test_not_linux?
    Browser.expects(:host).returns("bogus")
    assert !Browser.linux?
  end
  
end
