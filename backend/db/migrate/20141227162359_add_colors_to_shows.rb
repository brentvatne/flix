class AddColorsToShows < ActiveRecord::Migration
  def change
    add_column :shows, :colors, :string, array: true, default: []
  end
end
