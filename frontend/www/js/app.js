(function() {
  var app = angular.module('app',
    ['ionic',
     'ngCordova',
     'ngStorage',
     'ngFlux',
     'ionic.contrib.ui.tinderCards',
     'auth0',
     'angular-jwt'])

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('regionHttpInterceptor')
  });

  app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
})();
