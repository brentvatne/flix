class ChangeEmailToAuthSubjectOnUsers < ActiveRecord::Migration
  def change
    rename_column :users, :email, :auth_id
  end
end
