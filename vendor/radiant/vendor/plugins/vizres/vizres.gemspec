Gem::Specification.new do |s|
  s.name     = "vizres"
  s.version  = "0.5"
  s.date     = "2008-08-10"
  s.summary  = "Enables rendering of the body of an HTTP response from inside a functional test."
  s.email    = "pelargir@gmail.com"
  s.homepage = "http://github.com/pelargir/vizres"
  s.description = "Enables rendering of the body of an HTTP response from inside a functional test. " <<
                  "This makes it easy to diagnose problems when building assert_select statements " <<
                  "or just sanity check the output of the test."
  s.has_rdoc = true
  s.authors  = ["Matthew Bass"]
  s.files    = [
    "CHANGELOG",
    "MIT-LICENSE",
    "Rakefile",
		"README",
		"vizres.gemspec",
		"lib/vizres.rb",
		"lib/vizres/browser.rb",
		"test/vizres_test.rb",
		"test/vizres/browser_test.rb"
		]
  s.rdoc_options = ["--main", "README"]
  s.extra_rdoc_files = ["README"]
end