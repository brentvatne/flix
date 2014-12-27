(function() {
  var LikedShowsCtrl = function($scope, Store, Actions) {
    Store.bindState($scope, function() { $scope.shows = Store.getLikedShows(); });

    $scope.isFirstShow = function(i) {
      if (i == 0) {
        return true;
      }
    }

    $scope.isLastShow = function(i) {
      if (i == $scope.shows.length - 1) {
        console.log("yup it's the last one!");
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
