class AddRegionToShows < ActiveRecord::Migration
  def change
    add_column :shows, :region, :string, default: 'canada'
  end
end
