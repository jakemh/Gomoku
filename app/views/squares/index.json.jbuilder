json.array!(@squares) do |square|
  json.extract! square, 
  json.url square_url(square, format: :json)
end
