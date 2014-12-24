require Rails.root.to_s + '/lib/all_flicks_api'

task(download_show_database: :environment) do
  api = AllFlicksApi.new
  start_at = 0
  loop do
    shows = api.shows(start_at: start_at)
    shows.each do |show|
      Show.create(show)
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
