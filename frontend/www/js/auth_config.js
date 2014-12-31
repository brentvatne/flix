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
        console.log('no token');
        return null;
      }

      // If token is expired, get a new one
      if (jwtHelper.isTokenExpired(idToken)) {
        console.log('expired token');
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          console.log('refresh it');
          currentUser.token = idToken;
          Store.updateAuthToken(idToken);
          return idToken;
        });
      } else {
        console.log('not expired token');
        return idToken;
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });

  app.run(function($rootScope, auth, Store, jwtHelper, $location, Actions) {
    // This event gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      console.log(auth);
      console.log(auth.isAuthenticated);
      if (!auth.isAuthenticated) {
        var currentUser = Store.getCurrentUser(),
            token = currentUser && currentUser.token,
            profile = currentUser && currentUser.profile,
            refreshToken = currentUser && currentUser.refreshToken;

        console.log(currentUser);
        console.log(auth.isAuthenticated);
        console.log(token);
        console.log(profile);
        console.log(refreshToken);
        console.log(jwtHelper.isTokenExpired(token));

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
