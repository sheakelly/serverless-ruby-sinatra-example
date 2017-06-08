require 'sinatra'
require 'sinatra/json'
require 'aws-sdk'

get '/hello-world' do
  'Hello world!'
end
