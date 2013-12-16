module GamesHelper
	def initVal(value, min = 0)
	  if value == nil || value.to_i < min
	    return nil
	  else 
	  	return value.to_i
	  end

	end

	def time_expired?(params)
	  if params["force"] == "true"
	    puts "**FORCE MOVE**"
	    return true
	  end
	end
end
