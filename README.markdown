### Swipe movies in Netflix like people on Tinder

![Interface screenshots](https://github.com/brentvatne/tinder-netflix/blob/master/interface.png)

## Demos

Check out the [demo video](http://url.brentvatne.ca/LMhq). It's a 20mb
mp4 file and is slightly out of date from the current interface, so you may not want to check it out if you're on mobile.

Or you can try it out at [http://flix.brentvatne.ca](http://flix.brentvatne.ca/) - it's not the
prettiest on a large screen, resize it to be smaller and you'll be
happier. If you're using an iPhone, login and then save the app to your
home screen to get rid of the address bar.

The initial load will be pretty slow as there's a bunch of
JavaScript to be downloaded, and it's just served through a minimal Ruby
web server on Heroku. Also be warned, Auth0 doesn't seem to work great if you
choose to log in through Facebook and then handle that login with the
Facebook app (any ideas on how to fix this?). So if you log in through
Facebook, choose Chrome to handle the login - or just sign up for an
account by email and you won't have any issues.  It's a bit slower when
you open the web version on your phone vs running it native through a web
view, and it's been pointed out to me that it does not work so well on
Firefox.

Or you can just [download it from the Google Play store](http://url.brentvatne.ca/1kOgO).

## Intended Target Platform

The intended target device is my testing device: **Nexus 5 on Android Lollipop**,
but it works fine on most new phones I believe.

## Are you an iOS developer?

I don't have an iOS developer account so I can't push this to the Apple
Store, I would be great if someone could take charge of doing this and
ensuring it meets the Apple guidelines. Any volunteers?
brentvatne@gmail.com

## Contribute

The project is quite easy to set up thanks to Ionic's CLI.

- Make sure you have [Node](http://nodejs.org/) and [Ionic
  Framework](http://ionicframework.com/docs/guide/installation.html)
  installed
- Clone the repo and run `npm install` in the frontend directory
- Run `ionic platform add android` if you wish to test this on an
  Android device (this is the target platform)
- Add the inappbrowser plugin: `cordova plugin add org.apache.cordova.inappbrowser`
- To run a local webserver: `ionic serve` or to run it on your device
  `ionic run android`

There's a lot of low hanging fruit to improve on the front end, so feel
free to pick something and submit a pull request or open an issue if you
need a hand.

- [ ] Empty state: no movies found
- [ ] Loading indicators (first app load, fetching movies, fetching
  liked movies)
- [ ] Empty state: no liked movies (in list view)
- [ ] Offline mode (access saved list, but not new ones - download and
  cache images for saved movies?)
- [ ] Better list of liked movies with options to remove
- [ ] Unit and integration tests
- [ ] Detect region on first load rather than just defaulting to Canada

## Related projects

If you like this, you might also like
[Snaps](https://github.com/brentvatne/snaps) - another quick Ionic
project I built for creating a live photo feed through Firebase.

I also use a minimal wrapper around Facebook's
[dispatcher.js](http://facebook.github.io/flux/docs/dispatcher.html)
to use it in Angular and do away with some boilerplate, it's called
`angular-flux-helpers` on bower, or check out the repo on Github at
[brentvatne/angular-flux](https://github.com/brentvatne/angular-flux).

I made heavy use of
[ionic-ion-tinder-cards](https://github.com/driftyco/ionic-ion-tinder-cards)
for this app.

## Self-promotional plug

I work for [Madriska Inc.](http://madriska.com/). We do Rails, Clojure,
JavaScript, hybrid mobile apps and more. We work with clients big and
small in many different industries, and we prefer building long-lasting
relationships where we can get to know each other and the business.
[Shoot me an email](mailto:brent.vatne@madriska.com) if you have an
interesting project or business problem that you'd like some expert help
on.

## License
Copyright (c) 2014-2015 Brent Vatne. See the LICENSE file for license rights and limitations (MIT).
