(function() {
  var app = angular.module('app')

  // Config the auth provider
  //
  app.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider, AUTH0_CLIENT_ID, AUTH0_DOMAIN) {
    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      callbackURL: location.href,
      loginState: 'login'
    });
  })

  app.run(function(auth) {
    auth.hookEvents();
  })

  // Add an interceptor with the token
  //
  app.config(function (authProvider, $httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function(Store, Actions, jwtHelper, auth) {
      var currentUser = Store.getCurrentUser(),
          token = currentUser && currentUser.token,
          refreshToken = currentUser && currentUser.refreshToken;

      if ((!currentUser || currentUser == {}) || !token || !refreshToken) {
        return null;
      } else {
        if (jwtHelper.isTokenExpired(token)) {
          return auth.refreshIdToken(refreshToken).then(function(token) {
            Actions.updateAuthToken(token);
            return token;
          });
        } else {
          return token;
        }
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });

  app.run(function($rootScope, auth, Store, jwtHelper, $location, Actions) {
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var currentUser = Store.getCurrentUser(),
            token = currentUser && currentUser.token,
            profile = currentUser && currentUser.profile;

        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(profile, token);
            $rootScope.currentUser = currentUser;
          } else {
            auth.refreshIdToken(refreshToken).then(function(newToken) {
              Actions.updateAuthToken(newToken);
              auth.authenticate(profile, newToken);
              $rootScope.currentUser = currentUser;
              return newToken;
            });
          }
        }
      }
    });
  });
})();
