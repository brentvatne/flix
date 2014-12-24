(function() {
  var Store = function(FluxUtil, Dispatcher, ApiConstants, AppConstants, $localStorage) {
    /* Private */
    var _repo = $localStorage;

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

      dispatcherIndex: Dispatcher.register(function(payload) {
        console.log('Store', payload);
        var action = payload.action;

        if (action.response != ApiConstants.PENDING) {
          switch(action.actionType) {
            case AppConstants.SET_CURRENT_USER:
              _logIn(action.response);
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
