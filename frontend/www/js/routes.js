(function() {
  var Routes = function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('start', {
        url: '/start',
        template: '',
        controller: function($scope, $state) {
          // Just go to the main one if authenticated
          $state.go('main');
        },
        data: {
          requiresLogin: true
        }
      })
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

    $urlRouterProvider.otherwise('/start');
  }

  angular.module('app')
    .config(Routes);
})();
