(function() {
  var TinderflixApi = function($http, Dispatcher, AppConstants, ApiConstants) {
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

    /* Public Interface */
    return {
      fetchShows: function(preferences, userId) {
        key = AppConstants.FETCH_SHOWS
        params = {preferences: preferences, userId: userId}
        dispatch(key, ApiConstants.PENDING, params);
        $http.get('/shows', params).then(handleResponse(key, params));
      },

      fetchLiked: function(userId) {
      // stub
      },

      like: function(show, userId) {
      // stub
      },

      dislike: function(show, userId) {
      // stub
      }
    }
  }

  angular.module('app').
    factory('TinderflixApi', TinderflixApi)
})();
