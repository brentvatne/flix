class AddTraktToShows < ActiveRecord::Migration
  def change
    enable_extension :hstore
    add_column :shows, :trakt_id, :integer
    add_column :shows, :trakt_poster_url, :text
    add_column :shows, :trakt_data, :hstore
  end
end
