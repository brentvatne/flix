class CreateShows < ActiveRecord::Migration
  def change
    create_table :shows do |t|
      t.text :genre
      t.text :cast
      t.text :title
      t.text :description
      t.text :year
      t.text :imdb_rating
      t.text :image_url
    end
  end
end
