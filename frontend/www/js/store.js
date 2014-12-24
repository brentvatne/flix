(function() {
  var Store = function(FluxUtil, Dispatcher, ApiConstants, AppConstants, $localStorage, DEFAULT_PREFS) {
    /* Private */
    var _repo = $localStorage;

    var _shows = [],
        _likedShows = [];

    var _resetPrefs = function() {
      _repo.prefs = angular.copy(DEFAULT_PREFS);
    }

    var _setPrefs = function(newPrefs) {
      _repo.prefs = angular.copy(newPrefs);
    }

    // Initialize them if this is the first time
    if (!_repo.prefs) { _resetPrefs(); }

    var _logIn = function(options) {
      _repo.currentUser = {}
      _repo.currentUser.facebookId = options.id;
      _repo.currentUser.email = options.email;
      _repo.currentUser.name = options.name;
      _repo.currentUser.picture = options.picture.data.url;
      _repo.loggedIn = true;
    }

    // Hello there! Uncomment this to test things out
    //
    _logIn({
      facebookId: '1234doesntmatter',
      email: 'brentvatne@gmail.com',
      name: 'Brent Vatne',
      picture: {data: {url: 'https://avatars1.githubusercontent.com/u/90494?v=3&u=04502cb1fa18d66e70ac8fef8e8c21af6f25eaff&s=140'}}
    });

    var _logOut = function() {
      _repo.$reset();
      _resetPrefs();
    }

    /* Public Api */
    var store = FluxUtil.createStore({
      isLoggedIn: function() {
        return _repo.loggedIn === true;
      },

      getCurrentUser: function() {
        return _repo.currentUser;
      },

      getShows: function() {
        return _shows;
      },

      getLikedShows: function() {
        return _likedShows;
      },

      setPrefs: function(newPrefs) {
        return _setPrefs(newPrefs);
      },

      getPrefs: function() {
        return _repo.prefs;
      },

      dispatcherIndex: Dispatcher.register(function(payload) {
        console.log('Store', payload);
        var action = payload.action;

        if (action.response != ApiConstants.PENDING) {
          switch(action.actionType) {
            case AppConstants.SET_CURRENT_USER:
              _logIn(action.response);
              store.emitChange(action);
              break;
            case AppConstants.UPDATE_PREFS:
              _setPrefs(action.newPrefs);
              store.emitChange(action);
              break;
            case AppConstants.FETCH_SHOWS:
              _shows = action.response;
              store.emitChange(action);
              break;
            case AppConstants.FETCH_LIKED_SHOWS:
              _likedShows = action.response;
              store.emitChange(action);
              break;
            case AppConstants.LOG_OUT:
              _logOut();
              store.emitChange(action);
              break;
            case AppConstants.RESET_PREFS:
              _resetPrefs();
              store.emitChange(action);
              break;
            case AppConstants.LIKE_SHOW:
              break;
            case AppConstants.DISLIKE_SHOW:
              break;
          }

          return true;
        }
      })
    });

  return store;
}

  angular.module('app')
    .factory('Store', Store)
})();
