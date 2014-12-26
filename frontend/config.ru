use Rack::Static,
  urls: ["/js", "/css", "/lib", "/templates"],
  root: "www"

run lambda { |env|
  [ 200,
    {'Content-Type' => 'text/html', 'Cache-Control' => 'www, max-age=86400'},
    File.open('www/index.html', File::RDONLY) ]
}
