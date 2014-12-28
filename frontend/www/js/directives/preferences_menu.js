(function() {
  var preferencesMenu = function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/preferences_menu.html',
      replace: true,
      controller: 'PreferencesCtrl'
    }
  }

  angular.module('app').
    directive('preferencesMenu', preferencesMenu);
})();
