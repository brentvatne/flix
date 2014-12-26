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

      if ((!currentUser || currentUser == {}) || !idToken || !refreshToken) {
        return null;
      } else {
        if (jwtHelper.isTokenExpired(idToken)) {
          return auth.refreshIdToken(refreshToken).then(function(idToken) {
            Actions.updateAuthToken(idToken);
            return idToken;
          });
        } else {
          return idToken;
        }
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });
})();
