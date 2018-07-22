(function() {
    angular.module("app", ['ngMaterial', 'ngMessages', 'angularMoment'])
    .config(function($mdDateLocaleProvider, moment) {
      $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('YYYY-MM-DD');
      };
    });
})();
