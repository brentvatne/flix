(function() {
  var PosterPreloader = function(Store, AppConstants, ApiConstants, $timeout) {
    var _isActive = false;

    var _preloadImages = function(action) {
      if (action.actionType == AppConstants.FETCH_SHOWS && action.response != ApiConstants.PENDING) {
        angular.forEach(Store.getShows(), function(show, i) {
          $timeout(function() {
            var image = new Image;
            image.src = show.imageUrl;
          }, i * 150);
        });
      }
    }

    var _start = function() {
      if (_isActive === false) {
        Store.addChangeListener(_preloadImages);
        _isActive = true;
      }
    }

    var _stop = function() {
      if (isActive === true) {
        Store.removeChangeListener(_preloadImages);
      }
    }

    // Let's start this automatically
    _start();

    return {
      start: function() {
        _start();
      },

      stop: function() {
        _stop();
      },

      isActive: function() {
        return isActive;
      }
    }
  }

  angular.module('app').
    factory('PosterPreloader', PosterPreloader);
})();
