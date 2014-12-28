(function() {
  var LikedShowsCtrl = function($scope, Store, Actions, AppConstants, ApiConstants) {
    $scope.shows = Store.getLikedShows();

    $scope.openWithNetflix = function(show) {
      window.open("http://www.netflix.com/WiPlayer?movieid=" + show.netflixId, '_system')
    }

    Store.bindState($scope, function(action) {
      if (action && action.actionType == AppConstants.FETCH_LIKED_SHOWS &&
          action.response != ApiConstants.PENDING) {
        $scope.shows = Store.getLikedShows();
      }
    });

    $scope.isFirstShow = function(i) {
      if (i == 0) {
        return true;
      }
    }

    $scope.isLastShow = function(i) {
      if (i == $scope.shows.length - 1) {
        return true;
      }
    }

    $scope.rowHeight = function(i) {
      return $scope.isLastShow(i) ? '160px' : '90px'
    }
  }

  angular.module('app').
    controller('LikedShowsCtrl', LikedShowsCtrl);
})();
