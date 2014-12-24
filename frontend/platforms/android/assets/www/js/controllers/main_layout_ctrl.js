(function() {
  var MainLayoutCtrl = function($scope) {
    $scope.prefs = {}
    $scope.prefs.minImdbRating = 7.0
    $scope.prefs.minReleaseYear = 1970
    $scope.prefs.genre = {}
    $scope.prefs.genre.action = true
    $scope.prefs.genre.anime = true
    $scope.prefs.genre.canadian = true
    $scope.prefs.genre.classic = true
    $scope.prefs.genre.comedy = true
    $scope.prefs.genre.documentary = true
    $scope.prefs.genre.dramas = true
    $scope.prefs.genre.faith = true
    $scope.prefs.genre.foreign = true
    $scope.prefs.genre.gay = true
    $scope.prefs.genre.horror = true
    $scope.prefs.genre.independent = true
    $scope.prefs.genre.music = true
    $scope.prefs.genre.romantic = true
    $scope.prefs.genre.scifi = true
    $scope.prefs.genre.specialInterest = true
    $scope.prefs.genre.tv = true
    $scope.prefs.genre.thrillers = true

    $scope.$watchCollection('prefs', function() {
      // Do something..
    });
  };


  angular.module('app').
    controller('MainLayoutCtrl', MainLayoutCtrl);
})();
