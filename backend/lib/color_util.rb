require 'open-uri'

module ColorUtil
  extend self
  include Colorscore

  def extract_colors(show)
    begin
      file = Tempfile.new(show.id.to_s, encoding: 'ascii-8bit')
      file << open(show.image_url).read

      histogram = Histogram.new(file.path)
      file.close
      scores = histogram.scores
      scores.map(&:last).map(&:hex)
    rescue
      []
    end
  end
end
