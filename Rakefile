# For Bundler.with_clean_env
require 'bundler/setup'

PACKAGE_NAME = "sceptre-api"
VERSION = "1.0.0"
TRAVELING_RUBY_VERSION = "20150715-2.2.2"
THIN_VERSION = "1.6.3"
EVENTMACHINE_VERSION = "1.0.6"

desc "Package your app"
task :package => ['package:linux:x86_64']
# task :package => ['package:linux:x86', 'package:linux:x86_64', 'package:osx']

namespace :package do
  namespace :linux do
    # desc "Package your app for Linux x86"
    # task :x86 => [:bundle_install, "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-linux-x86.tar.gz"] do
    #   create_package("linux-x86")
    # end

    desc "Package your app for Linux x86_64"
    task :x86_64 => [:bundle_install,
                     "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-linux-x86_64.tar.gz"] do
      create_package("linux-x86_64")
    end
  end

  desc "Package your app for OS X"
  task :osx => [:bundle_install, "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-osx.tar.gz"] do
    create_package("osx")
  end

  desc "Install gems to local directory"
  task :bundle_install do
    if RUBY_VERSION !~ /^2\.2\./
      abort "You can only 'bundle install' using Ruby 2.1, because that's what Traveling Ruby uses."
    end
    sh "rm -rf packaging/tmp"
    sh "mkdir -p packaging/tmp"
    sh "cp Gemfile Gemfile.lock packaging/tmp/"
    Bundler.with_clean_env do
      sh "cd packaging/tmp && env BUNDLE_IGNORE_CONFIG=1 bundle install --path ../vendor --without development"
    end
    # sh "rm -rf packaging/tmp"
    sh "rm -f packaging/vendor/*/*/cache/*"
    sh "rm -rf packaging/vendor/ruby/*/extensions"
    sh "find packaging/vendor/ruby/*/gems -name '*.so' | xargs rm -f"
    sh "find packaging/vendor/ruby/*/gems -name '*.bundle' | xargs rm -f"
    sh "find packaging/vendor/ruby/*/gems -name '*.o' | xargs rm -f"
  end
end

# file "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-linux-x86.tar.gz" do
#   download_runtime("linux-x86")
# end

file "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-linux-x86_64.tar.gz" do
  download_runtime("linux-x86_64")
end

# file "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-osx.tar.gz" do
#   download_runtime("osx")
# end

file "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-linux-x86_64-thin-#{THIN_VERSION}.tar.gz" do
  download_native_extension("linux-x86_64", "thin-#{THIN_VERSION}")
end

file "packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-linux-x86_64-eventmachine-#{EVENTMACHINE_VERSION}.tar.gz" do
  download_native_extension("linux-x86_64", "eventmachine-#{EVENTMACHINE_VERSION}")
end

def create_package(target)
  # package_dir = "dist/#{PACKAGE_NAME}-#{VERSION}-#{target}"
  package_dir = "ruby-bin"
  sh "rm -rf #{package_dir}"
  sh "mkdir -p #{package_dir}"
  sh "mkdir -p #{package_dir}/lib/"
  sh "cp -R app #{package_dir}/lib/"
  sh "mkdir #{package_dir}/lib/ruby"
  sh "tar -xzf packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-#{target}.tar.gz -C #{package_dir}/lib/ruby"
  sh "cp rack_adapter.sh #{package_dir}/rack_adapter.sh"
  sh "cp rack_adapter.rb #{package_dir}/rack_adapter.rb"
  sh "cp -pR packaging/vendor #{package_dir}/lib/"
  sh "cp Gemfile #{package_dir}/lib/vendor/"
  sh "cp Gemfile.lock #{package_dir}/lib/vendor/"
  sh "mkdir #{package_dir}/lib/vendor/.bundle"
  sh "cp bundler-config #{package_dir}/lib/vendor/.bundle/config"
  # remove old bundler version and install newer one
  sh "find ./ -name \"bundler*\" -type d | xargs rm -rf"
  sh "sudo gem install bundler --version=1.13.6 --no-rdoc --no-ri --install-dir=#{package_dir}/lib/ruby/lib/ruby/gems/2.2.0"
  sh "sudo chmod -R 777 #{package_dir}"
  # if !ENV['DIR_ONLY']
  #   sh "tar -czf #{package_dir}.tar.gz #{package_dir}"
  #   sh "rm -rf #{package_dir}"
  # end
end

def download_runtime(target)
  sh "cd packaging && curl -L -O --fail " +
    "https://d6r77u77i8pq3.cloudfront.net/releases/traveling-ruby-#{TRAVELING_RUBY_VERSION}-#{target}.tar.gz"
end

def download_native_extension(target, gem_name_and_version)
  sh "curl -L --fail -o packaging/traveling-ruby-#{TRAVELING_RUBY_VERSION}-#{target}-#{gem_name_and_version}.tar.gz " +
    "https://d6r77u77i8pq3.cloudfront.net/releases/traveling-ruby-gems-#{TRAVELING_RUBY_VERSION}-#{target}/#{gem_name_and_version}.tar.gz"
end
