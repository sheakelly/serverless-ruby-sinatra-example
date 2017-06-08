#!/usr/bin/env ruby

require 'json'
require 'rack'

event = JSON.parse(ARGV[0])
context = JSON.parse(ARGV[1])

@app ||= Rack::Builder.parse_file("#{File.dirname(__FILE__)}/lib/app/config.ru").first

# enironment values defined here http://www.rubydoc.info/github/rack/rack/file/SPEC
env = {
  "rack.errors" => $stderr,
  "rack.input" => StringIO.new(event['body'] || ""),
  "rack.version" => Rack::VERSION,
  "rack.url_scheme" => "https",
  "REQUEST_METHOD" => event['httpMethod'],
  "SCRIPT_NAME" => "",
  "PATH_INFO" => event['path'] || "",
  "QUERY_STRING" => event['queryStringParameters'] || "",
  "SERVER_PORT" => 443,
  "SERVER_NAME" => "localhost"
}
event['headers'].each{ |key, value| env[key] = "HTTP_#{value}" }

begin
  status, headers, body = @app.call(env)

  body_content = ""
  body.each do |item|
    body_content += item.to_s
  end

  response = {
    "statusCode" => status,
    "headers" => headers,
    "body" => body_content
  }
rescue Exception => msg
  response = {
    "statusCode" => 500,
    "body" => msg
  }
end

puts response.to_json
