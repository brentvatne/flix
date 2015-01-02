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
          idToken = currentUser && currentUser.token,
          refreshToken = currentUser && currentUser.refreshToken;

      // If no token return null
      if (!idToken || !refreshToken) {
        return null;
      }

      // If token is expired, get a new one
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          Store.updateAuthToken(idToken);
          return idToken;
        });
      } else {
        return idToken;
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });

  app.run(function($rootScope, auth, Store, jwtHelper, $location, Actions) {
    // This event gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var currentUser = Store.getCurrentUser(),
            token = currentUser && currentUser.token,
            profile = currentUser && currentUser.profile,
            refreshToken = currentUser && currentUser.refreshToken;

        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(profile, token);
            $rootScope.currentUser = currentUser;
          } else {
            auth.refreshIdToken(refreshToken).then(function(newToken) {
              Store.updateAuthToken(newToken);
              auth.authenticate(profile, newToken);
              $rootScope.currentUser = Store.getCurrentUser();
              return newToken;
            });
          }
        }
      }
    });
  });
})();
