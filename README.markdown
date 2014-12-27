### Swipe movies in Netflix like people on Tinder

![Interface screenshots](https://github.com/brentvatne/tinder-netflix/blob/master/interface.png)

Check out the [demo video](http://url.brentvatne.ca/LMhq). It's a 20mb
mp4 file so you may not want to check it out if you're on mobile.

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
- Expand to have option to switch between countries
- Higher res images

etc...

Feel free to submit a pull request. If you'd like to and don't know how
to get started, shoot me an email at brentvatne@gmail.com and I'll help
you out.

If you like this, you might also like
[Snaps](https://github.com/brentvatne/snaps) - another quick Ionic
project I built for creating a live photo feed through Firebase.
