(function() {
  var showCard = function($ionicGesture) {
    return {
      restrict: 'E',
      templateUrl: 'templates/show_card.html',
      replace: true,
      link: function(scope, el, attrs) {
        scope.expandInfo = false;
        var $el = angular.element(el),
            $description = angular.element(el[0].querySelector('.show-card-details-container'));

        scope.toggleExpandInfo = function() {
          $el.toggleClass('info-is-expanded');
        }

        $ionicGesture.on('tap', scope.toggleExpandInfo, $description);
        // scope.$on('$destroy', function() {
        //   // Fix me - currently element is being removed before scope $destroy
        //   if ($description) {
        //     $ionicGesture.off('tap', scope.toggleExpandInfo, $description);
        //   }
        // });
      }
    }
  }

  angular.module('app').
    directive('showCard', showCard);
})();
