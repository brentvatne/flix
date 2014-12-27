(function() {
  var showCard = function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/show_card.html',
      replace: true
    }
  }

  angular.module('app').
    directive('showCard', showCard);
})();
