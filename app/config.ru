require 'rack'
require 'rack/contrib'
require_relative './app'

Rack::PostBodyContentTypeParser
Rack::NestedParams

run Sinatra::Application
