# Convert attributes from snake_case to lowerCamelCase
ActiveModel::Serializer.setup do |config|
  config.key_format = :lower_camel
end
