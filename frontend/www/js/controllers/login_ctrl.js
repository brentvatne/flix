(function() {
  var LoginCtrl = function($scope, $rootScope, $state, auth, Store, Actions, AppConstants) {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile'
      },
      standalone: true
    }, Actions.logIn, handleLoginError);

    Store.bindState($scope, function(action) {
      if (auth.isAuthenticated && action && action.actionType == AppConstants.SET_CURRENT_USER) {
        $rootScope.currentUser = Store.getCurrentUser();
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
