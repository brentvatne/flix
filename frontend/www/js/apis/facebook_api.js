(function() {
  var FacebookApi = function($http, Dispatcher, AppConstants, ApiConstants) {
    /* Private Methods */
    var handleResponse = function(key, params) {
      return function(response) {
        if (response.data.error) {
          dispatch(key, ApiConstants.ERROR, params);
        } else {
          dispatch(key, response.data, params);
        }
      }
    }

    var dispatch = function(key, response, params) {
      payload = {
        actionType: key,
        response: response,
        queryParams: params
      }

      Dispatcher.handleServerAction(payload);
    }

    /* Private API */
    return {
      fetchUserInfo: function(accessToken) {
        params = {access_token: accessToken, fields: "id,name,email,picture", format: "json"}
        key = AppConstants.SET_CURRENT_USER;
        dispatch(key, ApiConstants.PENDING, params);
        $http.get("https://graph.facebook.com/v2.2/me", {params: params}).
          then(handleResponse(key, params));
      }
    }
  }

  angular.module('app').
    factory('FacebookApi', FacebookApi)
})();
