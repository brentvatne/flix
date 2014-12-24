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
        abstract: true,
        templateUrl: 'main.html',
        controller: 'MainLayoutCtrl'
      })

      .state('main.home', {
        url: '/home',
        views: {
          mainContent: { templateUrl: 'main-content.html' }
        },
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/login');
  }

  angular.module('app')
    .config(Routes);
})();
