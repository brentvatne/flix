class User < ActiveRecord::Base
  has_many :likes, dependent: :destroy
  has_many :dislikes, dependent: :destroy
  has_many :liked_shows, through: :likes, class_name: 'Show', source: :show
  has_many :disliked_shows, through: :dislikes, class_name: 'Show', source: :show

  def like!(show)
    dislikes.where(show_id: show.id).first.try(:destroy)
    disliked_shows(true)
    liked_shows << show
    save!
  end

  def dislike!(show)
    likes.where(show_id: show.id).first.try(:destroy)
    liked_shows(true)
    disliked_shows << show
    save!
  end

  def show_ids
    liked_show_ids + disliked_show_ids
  end
end
