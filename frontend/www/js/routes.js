(function() {
  var Routes = function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        data: {
          requiresLogin: true
        }
      });

    $urlRouterProvider.otherwise('/login');
  }

  angular.module('app')
    .config(Routes);
})();
