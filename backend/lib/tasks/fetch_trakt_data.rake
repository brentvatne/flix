require Rails.root.to_s + '/lib/trakt_api'

task(fetch_trakt_data: :environment) do
  Show.find_each do |show|
    next unless show.trakt_data.blank? || show.trakt_data.empty?

    begin
      results = TraktApi.find_show(show)
      data = results.first
    rescue => e
      puts "TraktApi Error with #{show.title}"
    end

    if data.present?
      puts "Found #{data['title']}"
      show.update_attributes(trakt_id: data['tmdb_id'] || data['url'],
                             trakt_poster_url: (data['images'] || {})['poster'],
                             trakt_data: data)
    else
      puts "Could not find #{show.title}"
    end
  end
end
