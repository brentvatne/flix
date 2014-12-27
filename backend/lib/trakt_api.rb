class TraktApi
  include HTTParty
  base_uri 'api.trakt.tv'

  def self.find_show(show)
    if show.genre == 'TV Shows'
      get("/search/shows.json/#{ENV['TRAKT_API_KEY']}",
          query: {query: "#{show.title}"})
    else
      get("/search/movies.json/#{ENV['TRAKT_API_KEY']}",
          query: {query: "#{show.title} #{show.year}"})
    end
  end
end
