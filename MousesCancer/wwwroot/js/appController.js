(function() {
  angular.module("app")
    .controller("appController", appController);

  function appController($scope, $window, $http, moment) {
    $scope.mouses = [];
    $scope.localMouses = [];
    $scope.isOpen = false;
    $scope.myDate = new Date("2017-08-30");
    var chart = {};

    $http.get("/api/mouses")
      .then(function(resp) {
          angular.copy(resp.data, $scope.mouses);
          angular.copy(resp.data, $scope.localMouses);

          var keys = ['x'];
          var values = ['Datum'];
          Object.keys($scope.mouses).forEach(function(key) {
            keys.push(key);
            values.push($scope.mouses[key].toFixed(2));

          });

          //create chart
          chart = c3.generate({
            "bindto": "#chart",
            "data": {
              x: 'x',
              columns: [
                keys,
                values
              ],
              labels: true,
              colors: {
                "Datum": '#ff3412'
              }
            },
            "axis": {
              x: {
                type: 'timeseries',
                tick: {
                  fit: false,
                  format: '%Y-%m-%d'
                },
                label: 'Day'
              },
              y: {
                label: 'Datum'
              }
            }
          });

          $scope.myDate = new Date(keys[1]);
          $scope.minDate = new Date(moment(new Date(keys[1])).subtract(1, "days"));
          $scope.maxDate = new Date(keys[keys.length - 1]);

          d3.selectAll("circle")
            .style("fill", "white")
            .style("stroke", "red")
            .style("stroke-width", 5);

        },
        function(error) {
          console.warn(error);
        });

    $scope.dateChanged = function() {
      var chosenDate = moment($scope.myDate).format('YYYY-MM-DD');

      if ($scope.mouses.hasOwnProperty(chosenDate)) {
        var contains = $scope.localMouses.hasOwnProperty(chosenDate);

        if (contains) {
          delete $scope.localMouses[chosenDate];
        } else {
          $scope.localMouses[chosenDate] = $scope.mouses[chosenDate];
        }

        var keys = ['x'];
        var values = ['Datum'];
        Object.keys($scope.localMouses).forEach(function(key) {
          keys.push(key);
          values.push($scope.localMouses[key].toFixed(2));
        });

        if (chart) {
          chart.load({
            columns: [
              keys,
              values
            ],
            unload: true
          });
        }
      }

    }
  }
})();
  

