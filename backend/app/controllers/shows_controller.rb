class ShowsController < ApplicationController
  before_filter :find_show, only: [:like, :dislike]

  # Somehow ActiveModelSerializer isn't working with the proper
  # snakeCasing....
  #
  def index
    if params[:preferences].present?
      filter_options = params[:preferences]
      filter_options = filter_options.merge(user: current_user)
      @shows = Show.filter(filter_options).limit(15)
    else
      @shows = []
    end

    render json: @shows.map { |show|
      serialize_show(show)
    }
  end

  def liked
    render json: current_user.liked_shows.map { |show|
      serialize_show(show)
    }
  end

  def disliked
    render json: current_user.disliked_shows.map { |show|
      serialize_show(show)
    }
  end

  def like
    current_user.like!(@show)
    render json: {success: true}
  end

  def dislike
    current_user.dislike!(@show)
    render json: {success: true}
  end

  private

  def find_show
    @show = Show.find(params[:id])
  end

  def serialize_show(show)
    { id: show.id,
      netflixId: show.netflix_id,
      genre: show.genre,
      cast: show.cast,
      title: show.title,
      director: show.director,
      description: show.description,
      year: show.year,
      imdbRating: show.imdb_rating,
      imageUrl: show.image_url }
  end
end
