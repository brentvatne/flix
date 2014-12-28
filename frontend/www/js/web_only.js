if (!window.cordova) {
  // Disable overscroll
  document.addEventListener("DOMContentLoaded", function(event) {
    // /Mobile/.test(navigator.userAgent) && !location.hash && setTimeout(function () {
    //     if (!pageYOffset) window.scrollTo(0, 1);
    // }, 50);

    document.body.addEventListener('touchmove',function(e) {
      if (e.target && e.target.type == "range") {
      } else {
        e.preventDefault();
      }
      // else if (e.target.classList.indexOf('cards-container') > 0) {
      // e.preventDefault();
    });
  });

  function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

  loadScript('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js', function() {
    WebFont.load({
      google: {
         families: ['Droid Sans']
       }
     });
  });

  // Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-10128745-10', 'auto');
  ga('send', 'pageview');
}
