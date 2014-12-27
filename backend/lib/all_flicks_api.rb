class AllFlicksApi
  BASE_URL = "http://www.allflicks.net/wp-content/themes/responsive/processing/server_processing_{region}.php?sEcho=3&iColumns=7&sColumns=&iDisplayStart={displayStartVal}&iDisplayLength=100&mDataProp_0=&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&iSortCol_0=6&sSortDir_0=desc&iSortingCols=1&bSortable_0=false&bSortable_1=false&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&min=&max=&movies=&shows="

  def initialize(region = 'canada')
    @shows = {}
    @region = region
  end

  def base_url
    BASE_URL.gsub('{region}', @region)
  end

  def endpoint(start_at)
    base_url.gsub(
      '{displayStartVal}',
      start_at.to_s
    )
  end

  def make_request(options = {})
    start_at = options[:start_at] || 0
    response = HTTParty.get(endpoint(start_at))
    JSON.parse(response)
  end

  def number_of_shows
    @number_of_shows ||= begin
      response = make_request
      response["iTotalDisplayRecords"].to_i
    end
  end

  def shows(options = {})
    @shows[options] = parse_shows(make_request(options))
  end

  def parse_shows(response)
    response['aaData'].map { |show|
      {netflix_id: show[0],
       image_url: show[1],
       title: show[2],
       year: show[3],
       imdb_rating: show[10],
       genre: show[5],
       cast: show[7],
       director: show[8],
       description: show[9]}
    }
  end
end
