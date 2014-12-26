### Swipe movies in Netflix like people on Tinder

Check out the [demo gif](https://github.com/brentvatne/tinder-netflix/blob/master/demo.gif).
Be warned, it's 6mb, so you might not want to if you're on a mobile device.

Or you can try it out at
[http://flix.brentvatne.ca](http://flix.brentvatne.ca/) - it's not the
prettiest on a large screen, resize it to be smaller and you'll be
happier. This will load pretty slowly as I didn't minify or concat any
of the JavaScript - I just serve up the as-is JS through a minimal Ruby
web server. Also be warned, Auth0 doesn't seem to work great if you
choose to log in through Facebook and then handle that login with the
Facebook app. So if you log in through Facebook, choose Chrome -
or just sign up for an account and you won't have any issues. It's a
bit slower when you open the web version on your phone vs run it native
through a web view.

I built this in one day as a quick tool for myself and my friends to use.
There's a lot of low hanging fruit to improve on the front end:

- Animation performance
- Loading indicators
- More information on the cards (have a bunch in the database for each
  title, thanks to allflicks.net)
- Expand to have option to switch between countries
- Better auth/backend
- Higher res images
- Better aesthetics overall

etc...

Feel free to submit a pull request. If you'd like to and don't know how
to get started, shoot me an email at brentvatne@gmail.com and I'll help
you out.

If you like this, you might also like
[Snaps](https://github.com/brentvatne/snaps) - another quick Ionic
project I built for creating a live photo feed through Firebase.
