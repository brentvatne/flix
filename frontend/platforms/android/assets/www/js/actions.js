(function() {
  var Actions = function(TinderflixApi, FacebookApi, Store, Dispatcher, ApiConstants, AppConstants) {
    return {
      setCurrentUser: function(facebookAuthToken) {
        payload = {
          actionType: AppConstants.SET_CURRENT_USER,
          response: ApiConstants.PENDING,
          params: {facebookAuthToken: facebookAuthToken}
        }

        Dispatcher.handleServerAction(payload);
        FacebookApi.fetchUserInfo(facebookAuthToken);
      }
    }
  }

  angular.module('app').factory('Actions', Actions)
})();
