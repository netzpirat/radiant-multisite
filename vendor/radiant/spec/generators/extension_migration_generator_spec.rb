require File.dirname(__FILE__) + "/extension_generators_spec_helper"

describe "ExtensionMigrationGenerator with normal options" do
  it_should_behave_like AllGenerators
  it_should_behave_like AllExtensionGenerators
  
  before(:each) do
    cp_r File.join(BASE_ROOT, 'lib/generators/extension_migration'),  File.join(RADIANT_ROOT, 'vendor/generators')
    run_generator('extension_migration', %w(example ChangeColumnsInSomeTable))
  end
  
  it 'should generate the migration file in the correct location' do
    'vendor/extensions/example'.should have_generated_migration('ChangeColumnsInSomeTable')
  end
  
  after(:each) do
    extension_dir = File.join(RADIANT_ROOT, 'vendor/extensions/example')
    rm_rf Dir["#{extension_dir}/db/migrate/*"]
    rm_rf Dir["#{RADIANT_ROOT}/vendor/generators/*"]
  end
end
