class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.text :email
      t.text :facebook_id
      t.text :name
    end

    create_table :likes do |t|
      t.references :user
      t.references :show
    end

    create_table :dislikes do |t|
      t.references :user
      t.references :show
    end
  end
end
