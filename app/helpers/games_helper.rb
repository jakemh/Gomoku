module GamesHelper
	def initVal(value, min = 0)
	  if value == nil || value < min
	    return false
	  else return value
	  end

	end
end