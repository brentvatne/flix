(function() {
  var AppConstants = function(FluxUtil) {
    return FluxUtil.defineConstants([
      'SET_CURRENT_USER', 'UPDATE_AUTH_TOKEN',
      'UPDATE_PREFS', 'RESET_PREFS', 'FETCH_SHOWS',
      'FETCH_LIKED_SHOWS', 'LIKE_SHOW',
      'DISLIKE_SHOW', 'SET_REGION',
      'EXCLUSIVELY_SELECT_GENRE'
    ]);
  };

  var ApiConstants = function(FluxUtil) {
    return FluxUtil.defineConstants([
      'PENDING', 'ERROR'
    ]);
  };

  angular.module('app')
    .factory('AppConstants', AppConstants)
    .factory('ApiConstants', ApiConstants)
})();
