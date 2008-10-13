load 'deploy' if respond_to?(:namespace) # cap2 differentiator
Dir['vendor/plugins/*/recipes/*.rb'].each { |plugin| load(plugin) }
Dir['lib/recipes/*.rb'].each { |receipe| load(receipe) }
load 'config/deploy'