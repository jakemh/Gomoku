source 'https://rubygems.org'
ruby '1.9.3', :engine => 'jruby', :engine_version => '1.7.8'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.1'
# gem 'newrelic_rpm'
# Use sqlite3 as the database for Active Record
# gem 'sqlite3'

# gem 'thin'
# gem 'puma'
gem 'trinidad'
# gem 'jdbcsqlite3'# Use SCSS for stylesheets
group :development, :test do
	gem 'activerecord-jdbcsqlite3-adapter'
end
group :production do
	gem 'activerecord-jdbcpostgresql-adapter'
	gem 'rails_12factor'

end
gem 'sass-rails', '~> 4.0.0'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.1.2'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]
