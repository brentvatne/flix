(function() {
  var LoginCtrl = function($scope, $rootScope, $state, auth, Store, Actions) {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile'
      },
      standalone: true
    }, Actions.logIn, handleLoginError);

    Store.bindState($scope, function() {
      if (auth.isAuthenticated) {
        $state.go('main');
      }
    });

    function handleLoginError() {
      // Do something
    }
  }

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
})();
