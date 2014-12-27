(function() {
  var regionHttpInterceptor = function(Store) {
    return {
      request: function(request) {
        request.headers['Region'] = Store.getRegion();
        return request;
      }
    }
  }

  angular.module('app').
    factory('regionHttpInterceptor', regionHttpInterceptor);
})();
