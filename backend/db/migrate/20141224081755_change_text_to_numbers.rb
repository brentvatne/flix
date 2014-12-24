class ChangeTextToNumbers < ActiveRecord::Migration
  def change
    execute("
      alter table shows alter column year type integer using (year::integer);
      alter table shows alter column imdb_rating type decimal using (imdb_rating::decimal);
    ")
  end
end
