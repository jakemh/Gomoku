class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

	def validate(value, min = 0)
	  	if value == nil || value.to_i < min
	    	return nil
	  	else return value.to_i
	  	end
	end

	def time_expired?(params)
	  if params["force"] == "true"
	    puts "**FORCE MOVE**"
	    return true
	  end
	end
end
