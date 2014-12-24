(function() {
  var Dispatcher = function(FluxUtil) {
    return FluxUtil.createDispatcher();
  }

  angular.module('app')
    .factory('Dispatcher', Dispatcher)
})();
