(function() {
  var Actions = function(FlixApi, Store, Dispatcher, ApiConstants, AppConstants, auth) {
    return {
      logIn: function(profile, token, accessToken, state, refreshToken) {
        payload = {
          actionType: AppConstants.SET_CURRENT_USER,
          data: {
            profile: profile,
            token: token,
            accessToken: accessToken,
            refreshToken: refreshToken,
            state: state
          }
        }

        Dispatcher.handleServerAction(payload);
      },

      logOut: function() {
        payload = {
          actionType: AppConstants.LOG_OUT
        }

        Dispatcher.handleViewAction(payload);
        auth.signout();
      },

      updateAuthToken: function(newToken) {
        payload = {
          actionType: AppConstants.UPDATE_AUTH_TOKEN,
          data: {
            token: newToken
          }
        }

        Dispatcher.handleServerAction(payload);
      },

      resetPreferences: function() {
        payload = {
          actionType: AppConstants.RESET_PREFS
        }

        Dispatcher.handleViewAction(payload);
      },

      updatePrefs: function(prefs) {
        payload = {
          actionType: AppConstants.UPDATE_PREFS,
          newPrefs: prefs
        }

        Dispatcher.handleViewAction(payload);
      },

      fetchShows: function() {
        var userEmail = (Store.getCurrentUser() || {}).email,
            prefs = Store.getPrefs();

        FlixApi.fetchShows(prefs, userEmail);
      },

      fetchLikedShows: function() {
        var userEmail = (Store.getCurrentUser() || {}).email;

        FlixApi.fetchLikedShows(userEmail);
      },

      likeShow: function(showId) {
        var userEmail = (Store.getCurrentUser() || {}).email;
        FlixApi.likeShow(showId, userEmail);
      },

      dislikeShow: function(showId) {
        var userEmail = (Store.getCurrentUser() || {}).email;
        FlixApi.dislikeShow(showId, userEmail);
      },

      setRegion: function(newRegion) {
        payload = {
          actionType: AppConstants.SET_REGION,
          region: newRegion
        }

        Dispatcher.handleViewAction(payload);
      }
    }
  }

  angular.module('app').factory('Actions', Actions)
})();
