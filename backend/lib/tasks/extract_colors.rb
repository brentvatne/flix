require Rails.root.to_s + '/lib/color_util'

task(extract_colors: :environment) do

require Rails.root.to_s + '/lib/color_util'
  Show.find_each do |show|
    begin
      if show.colors.empty? && (colors = ColorUtil.extract_colors(show)).any?
        show.update_attributes(colors: colors)
        puts "Added #{colors.inspect} to #{show.title}"
      end
    rescue
      puts "Oops, couldn't find #{show.title}"
    end
  end
end
