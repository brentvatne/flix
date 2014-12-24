(function() {
  var DEFAULT_PREFS = {
    genre: {
      thrillers: true,
      tv: true,
      specialInterest: true,
      scifi: true,
      romantic: true,
      music: true,
      independent: true,
      horror: true,
      children: true,
      gay: true,
      foreign: true,
      faith: true,
      dramas: true,
      documentary: true,
      comedy: true,
      classic: true,
      canadian: true,
      anime: true,
      action: true,
    },
    minReleaseYear: 1970,
    minImdbRating: 7.0,
  }

  angular.module('app').
    value('DEFAULT_PREFS', DEFAULT_PREFS);
})();
