(function() {
  var Routes = function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      })

      .state('main', {
        url: '/main',
        templateUrl: 'main.html',
      });

    $urlRouterProvider.otherwise('/login');
  }

  angular.module('app')
    .config(Routes);
})();
