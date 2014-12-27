(function() {
  var PreferencesCtrl = function($scope, Store, Actions, AppConstants) {
    $scope.prefs = Store.getPrefs();

    // Update the state of local prefs when reset occurs
    Store.bindState($scope, function(action) {
      if (action && (action.actionType == AppConstants.RESET_PREFS ||
                     action.actionType == AppConstants.EXCLUSIVELY_SELECT_GENRE)) {
        $scope.prefs = Store.getPrefs();
      }
    });

    // Update the state of prefs in the store when changed in the interface
    $scope.update = function() { Actions.updatePrefs($scope.prefs); };

    $scope.exclusivelySelectGenre = function(genre) {
      Actions.exclusivelySelectGenre(genre);
    };
  };

  angular.module('app').
    controller('PreferencesCtrl', PreferencesCtrl);
})();
