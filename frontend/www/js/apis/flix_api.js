(function() {
  var FlixApi = function($http, Dispatcher, AppConstants, ApiConstants) {
    var BASE_URL = 'http://flix-api.brentvatne.ca';
    // var BASE_URL = 'http://localhost:3000';

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
      fetchShows: function(preferences, userEmail) {
        key = AppConstants.FETCH_SHOWS
        params = {preferences: preferences, email: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.get(BASE_URL + '/shows', {params: params}).
          then(handleResponse(key, params));
      },

      fetchLikedShows: function(userEmail) {
        key = AppConstants.FETCH_LIKED_SHOWS
        params = {email: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.get(BASE_URL + '/shows/liked', {params: params}).
          then(handleResponse(key, params));
      },

      likeShow: function(showId, userEmail) {
        key = AppConstants.LIKE_SHOW
        params = {showId: showId, email: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.post(BASE_URL + '/shows/' + showId + '/like', {email: userEmail}).
          then(handleResponse(key, params));
      },

      dislikeShow: function(showId, userEmail) {
        key = AppConstants.DISLIKE_SHOW
        params = {showId: showId, userEmail: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.post(BASE_URL + '/shows/' + showId + '/dislike', {email: userEmail}).
          then(handleResponse(key, params));
      }
    }
  }

  angular.module('app').
    factory('FlixApi', FlixApi)
})();
