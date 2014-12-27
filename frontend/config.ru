use Rack::Static,
  urls: ["/dist", "/js", "/css", "/lib", "/templates", "/images"],
  root: "www"

run lambda { |env|
  [ 200,
    {'Content-Type' => 'text/html', 'Cache-Control' => 'www, max-age=86400'},
    File.open('www/web_index.html', File::RDONLY) ]
}
