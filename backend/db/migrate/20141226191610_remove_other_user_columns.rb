class RemoveOtherUserColumns < ActiveRecord::Migration
  def change
    remove_column :users, :name
    remove_column :users, :facebook_id
  end
end
