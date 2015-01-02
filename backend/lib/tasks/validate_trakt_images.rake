require Rails.root.to_s + '/lib/trakt_api'

task(validate_trakt_images: :environment) do
  Show.find_each do |show|
    begin
      if show.trakt_images.present? && show.trakt_images['poster'].present?
        show.update_attributes(trakt_poster_url: show.trakt_images['poster'])
        request = HTTParty.get(show.trakt_poster_url)
        if request.response.code == "404"
          puts "#{request.response.code}: #{show.trakt_images['poster']}"
          show.update_attributes(trakt_poster_url: nil)
          show.trakt_data['images']['poster'] = ''
          show.save
          puts "Cleared image for #{show.title}"
        end
      end
    rescue => e
      puts e
    end
  end
end
