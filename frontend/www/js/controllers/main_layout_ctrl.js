(function() {
  var MainLayoutCtrl = function($scope, Store, Actions) {
    $scope.prefs = Store.getPrefs();
    console.log($scope.prefs);
    $scope.isLoggedIn = Store.isLoggedIn();

    $scope.update = function() {
      Actions.updatePrefs($scope.prefs);
    };
  };


  angular.module('app').
    controller('MainLayoutCtrl', MainLayoutCtrl);
})();
