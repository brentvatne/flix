class ShowSerializer < ActiveModel::Serializer
  attributes :id, :netflix_id, :genre, :cast, :title, :director,
    :description, :year, :imdb_rating, :image_url
end
