(function(){
	'use strict';
	/**
	* Miluz Module
	*
	* Angular demo sample
	*/
	var app = angular.module('Miluz', ['ngResource', 'ui.bootstrap']);

    app.factory('matchesFactory', function($resource) {
      return $resource('http://worldcup.sfg.io/matches');
    });

    app.controller('AlertCtrl', ['$scope', function($scope){
        $scope.alerts = [
            {type: 'danger', msg : 'Danger alert'},
            {type: 'success', msg: 'Success alert'}
        ];
        $scope.addAlert = function(){
            $scope.alerts.push({ msg: 'New alert'})
        };

        $scope.closeAlert = function(index){
            $scope.alerts.splice(index, 1);
        };
    }]);

    app.controller('MatchesCtrl', ['$http', function($http){
		var games = this;

		$http({method: 'GET', url: 'http://worldcup.sfg.io/matches'}).
	    success(function(data, status, headers, config) {
	      // this callback will be called asynchronously
	      // when the response is available
	      games.matches = data;
	      console.log('success');
	    }).
	    error(function(data, status, headers, config) {
	      // called asynchronously if an error occurs
	      // or server returns response with an error status
	      console.log('error');
	    });
	}]);
})();