(function() {
  var PreferencesCtrl = function($scope, Store, Actions, AppConstants) {
    $scope.prefs = Store.getPrefs();
    $scope.isLoggedIn = Store.isLoggedIn();

    Store.bindState($scope, function(action) {
      if (action) {
        console.log(action.actionType);
      }
      if (action && action.actionType == AppConstants.RESET_PREFS) {
        $scope.prefs = Store.getPrefs();
      }
    });

    $scope.update = function() {
      Actions.updatePrefs($scope.prefs);
    };

    $scope.shows = [];
    Store.bindState($scope, function() {
      $scope.shows = Store.getShows();
    });

    Actions.fetchShows();

    $scope.cardDestroyed = function(index) {
      Actions.dislikeShow($scope.shows[index].netflixId);
      $scope.shows.splice(index, 1);
    }

    $scope.cardSwiped = function(index) {
      Actions.likeShow($scope.shows[index].netflixId);
    }
  };

  angular.module('app').
    controller('PreferencesCtrl', PreferencesCtrl);
})();
