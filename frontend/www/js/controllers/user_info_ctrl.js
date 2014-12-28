(function() {
  var UserInfoCtrl = function($scope, $timeout, Store, Actions, AppConstants) {
    Store.bindState($scope, function(action) {
      $scope.region = Store.getRegion();

      if (action && action.actionType == AppConstants.SET_REGION) {
        $timeout((function() {
          Actions.fetchShows();
        }), 0);
      }
    });

    $scope.changeRegion = function() {
      if ($scope.region == 'canada') {
        Actions.setRegion('usa');
      } else {
        Actions.setRegion('canada');
      }
    }

    $scope.regionalFlagUrl = function() {
      if ($scope.region == null) {
        return null;
      }
      return 'images/' + $scope.region + '.png'
    }
  }

  angular.module('app').
    controller('UserInfoCtrl', UserInfoCtrl);
})();
