(function() {
  var CardsCtrl = function($scope, Store, Actions, $ionicSideMenuDelegate) {
    $scope.sideMenuIsOpen = function() {
      return $ionicSideMenuDelegate.isOpenLeft();
    }

    $scope.shows = [];
    Store.bindState($scope, function() {
      $scope.shows = Store.getShows();
    });

    Actions.fetchShows();

    $scope.partialSwipeShow = function(index) {
      console.log('partial swipe');
    }

    $scope.snapBackShow = function(index) {
      console.log('snap back');
    }

    $scope.destroyShow = function(index) {
      console.log('destroy show');
      $scope.shows.splice(index, 1);
      if ($scope.shows.length < 3) {
        Actions.fetchShows();
      }
    }

    $scope.dislikedShow = function(index) {
      console.log('disliked')
      Actions.dislikeShow($scope.shows[index].id);
    }

    $scope.likedShow = function(index) {
      console.log('liked')
      Actions.likeShow($scope.shows[index].id);
    }
  };

  angular.module('app').
    controller('CardsCtrl', CardsCtrl);
})();
