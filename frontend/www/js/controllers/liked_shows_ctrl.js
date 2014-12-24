(function() {
  var LikedShowsCtrl = function($scope, Store, Actions) {
    Store.bindState($scope, function() {
      $scope.shows = Store.getLikedShows();
    });
  }

  angular.module('app').
    controller('LikedShowsCtrl', LikedShowsCtrl);
})();
