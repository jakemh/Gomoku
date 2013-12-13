module GamesHelper
	def initVal(value, min = 0)
	  if value == nil || value < min
	    return false
	  else return value
	  end

	end

	def time_expired?(params)
	  if params["force"] == "true"
	    puts "**FORCE MOVE**"
	    return true
	  end
	end
end
