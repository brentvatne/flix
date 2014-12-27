require Rails.root.to_s + '/lib/all_flicks_api'

task(download_canadian_show_database: :environment) do
  api = AllFlicksApi.new('canada')
  start_at = 0
  loop do
    shows = api.shows(start_at: start_at)
    shows.each do |show|
      Show.create(show.merge(region: 'canada'))
      puts "Created #{show[:title]}."
    end
    start_at = start_at + 100
    if shows.length < 100
      puts "Stopping at #{start_at}"
      puts shows.length
      break
    end
  end
end

task(download_usa_show_database: :environment) do
  api = AllFlicksApi.new('usa')
  start_at = 0
  loop do
    shows = api.shows(start_at: start_at)
    shows.each do |show|
      Show.create(show.merge(region: 'usa'))
      puts "created #{show[:title]}."
    end
    start_at = start_at + 100
    if shows.length < 100
      puts "stopping at #{start_at}"
      puts shows.length
      break
    end
  end
end
