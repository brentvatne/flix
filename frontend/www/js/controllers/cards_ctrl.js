(function() {
  var CardsCtrl = function($scope, Store, PosterPreloader, Actions, $ionicSideMenuDelegate) {
    $scope.sideMenuIsOpen = function() {
      return $ionicSideMenuDelegate.isOpenLeft();
    }


    $scope.dismissShow = function(show) {
      var i = $scope.shows.indexOf(show);
      $scope.dislikedShow(i);
      $scope.destroyShow(i);
    }

    $scope.saveShow = function(show) {
      var i = $scope.shows.indexOf(show);
      $scope.likedShow(i);
      $scope.destroyShow(i);
    }

    /* Card callbacks from swiping */
    $scope.destroyShow = function(index) {
      $scope.shows.splice(index, 1);
      if ($scope.shows.length < 3) {
        Actions.fetchShows();
      }
    }

    $scope.dislikedShow = function(index) {
      Actions.dislikeShow($scope.shows[index].id);
    }

    $scope.likedShow = function(index) {
      Actions.likeShow($scope.shows[index].id);
    }

    $scope.partialSwipeShow = function(index) { }
    $scope.snapBackShow = function(index) { }

    /* Initialize the state */
    Store.bindState($scope, function() { $scope.shows = Store.getShows(); });
    Actions.fetchShows();
  };

  angular.module('app').
    controller('CardsCtrl', CardsCtrl);
})();
