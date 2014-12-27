class ShowsController < ApplicationController
  before_filter :find_show, only: [:like, :dislike]

  # Somehow ActiveModelSerializer isn't working with the proper
  # snakeCasing....
  #
  def index
    if params[:preferences].present?
      filter_options = params[:preferences]
      filter_options = filter_options.merge(user: current_user)
      filter_options = filter_options.merge(region: request.headers['Region'])
      @shows = Show.filter(filter_options).limit(10)
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
    ShowSerializer.new(show, root: false)
  end
end
