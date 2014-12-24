(function() {
  var LoginCtrl = function($scope, $rootScope, Store, Actions, FACEBOOK_APP_ID, $cordovaOauth, $state) {
    $scope.facebookLogin = function() {
      $cordovaOauth.facebook(FACEBOOK_APP_ID, ["public_profile", "email"]).then(function(result) {
        Actions.setCurrentUser(result.access_token);
      });
    }

    Store.bindState($scope, function() {
      if (Store.isLoggedIn()) {
        $rootScope.currentUser = Store.getCurrentUser();
        $state.go('main.home');
      }
    });
  }

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
})();
