(function() {
  var CardsCtrl = function($scope, Store, PosterPreloader, Actions, $ionicSideMenuDelegate, AppConstants, ApiConstants) {
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
      if ($scope.shows.length <= 3 && !$scope.fetchInProgress) {
        $scope.fetchInProgress = true;
        $scope.appendShows = true;
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
    Store.bindState($scope, function(action) {
      if (action && action.actionType == AppConstants.FETCH_SHOWS) {
        if (action.response == ApiConstants.PENDING) {
          $scope.fetchInProgress = true;
        } else {
          $scope.updateShows(Store.getShows());
          $scope.fetchInProgress = false;
        }
      }
    });

    // Ensures that we don't have any duplicate shows
    $scope.updateShows = function(shows) {
      if ($scope.appendShows) {
        $scope.shows = _.union($scope.shows, shows);
        $scope.shows = _.uniq($scope.shows, false, function(show) {
          return show.id;
        });
      } else {
        $scope.shows = shows;
      }
    }

    Actions.fetchShows();
  };

  angular.module('app').
    controller('CardsCtrl', CardsCtrl);
})();
