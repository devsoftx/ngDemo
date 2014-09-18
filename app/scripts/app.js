(function(){
	'use strict';
	/**
	* Miluz Module
	*
	* Angular demo sample
	*/
	var app = angular.module('Miluz', ['ui.bootstrap', 'ngGrid']);
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

    app.controller('PaginationCtrl', ['$scope','$http', function($scope, $http){
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [25, 50, 100],
            pageSize: 25,
            currentPage: 1
        };
        $scope.setPagingData = function(data, page, pageSize){
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get('http://worldcup.sfg.io/matches').success(function (largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });
                } else {
                    $http.get('http://worldcup.sfg.io/matches').success(function (largeLoad) {
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.gridOptions = {
            data: 'myData',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [{field: 'match_number', displayName: 'match_number', width: 'auto'},
                        {field: 'location', displayName: 'location', width: 'auto'},
                        {field: 'status', displayName: 'status', width: 'auto'},
                        {field: 'winner', displayName: 'winner', width: 'auto'}]
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