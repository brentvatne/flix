class ShowSerializer < ActiveModel::Serializer
  attributes :id, :netflix_id, :genre, :cast, :title, :director,
    :description, :year, :imdb_rating, :image_url, :primary_color,
    :primary_contrast_color

  def image_url
    object.poster_url
  end

  def primary_color
    object.colors.first || '000000'
  end

  def primary_contrast_color
    color = object.colors.first || '000000'
    brightness_value = (color.scan(/../).map {|color| color.hex}).sum
    brightness_value > 382.5 ? '222222' : 'ffffff'
  end
end
