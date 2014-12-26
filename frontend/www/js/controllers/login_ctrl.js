(function() {
  var LoginCtrl = function($scope, $rootScope, $state, auth, Store, Actions) {
    $scope.facebookLogin = function() { Actions.login(); }

    var handleLoginError = function() {
      // Do something
    }

    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile'
      },
      standalone: true
    }, Actions.logIn, handleLoginError);

    Store.bindState($scope, function() {
      if (Store.isLoggedIn()) {
        $state.go('main');
      }
    });
  }

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
})();
