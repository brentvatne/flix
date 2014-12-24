(function() {
  var Store = function(FluxUtil, Dispatcher, ApiConstants, AppConstants, $localStorage, DEFAULT_PREFS) {
    /* Private */
    var _repo = $localStorage;

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
      _repo.loggedIn = true;
    }
    var _logOut = function() {
      _repo.$reset();
    }

    /* Public Api */
    var store = FluxUtil.createStore({
      isLoggedIn: function() {
        return _repo.loggedIn === true;
      },

      getCurrentUser: function() {
        return _repo.currentUser;
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
