'use strict';

// Declare app level module which depends on views, and components
angular.module('fine', ['ngRoute','ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/multiRow', {
                templateUrl: 'multiRow/MRdefaultView.html',
                controller: 'multiRowCtrl'
            })
            .when('/singleRow', {
                templateUrl: 'singleRow/SRdefaultView.html',
                controller: 'singleRowCtrl'
            })
            .otherwise({redirectTo: '/multiRow'});
    }])


    // Service gegevens op uit file:
    .service('recordsFromFileService', function ($http) {
        this.getData = function () {
            return $http.get('landen.json');
        }
    })

    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    })

    .controller('multiRowCtrl', function ($scope, filterFilter,recordsFromFileService,$rootScope) {
        $scope.readingFromDatabase=true;
        recordsFromFileService.getData()
            .then(
            function(result) {
                $scope.readingFromDatabase=false;
                $scope.records = result.data;
                $scope.totalRecords = $scope.records.length;
                // create empty search model (object) to trigger $watch on update
                $scope.search = {};

                $scope.resetFilters = function () {
                    // needs to be a function or it won't trigger a $watch
                    $scope.search = {};
                };

                // pagination controls
                $scope.currentPage = 1;
                $scope.entryLimit = 5; // records per page
                $scope.noOfPages = Math.ceil($scope.totalRecords / $scope.entryLimit);

                // $watch search to update pagination
                $scope.$watch('search', function (newVal, oldVal) {
                    $scope.filtered = filterFilter($scope.records, newVal);
                    $scope.totalRecords = $scope.filtered.length;
                    $scope.noOfPages = Math.ceil($scope.totalRecords / $scope.entryLimit);
                    $scope.currentPage = 1;
                }, true);
            }
            ,
            function(result) {
                $scope.readingFromDatabase=false;
                console.log('Error');
            }
        );

        $scope.selectRow = function(id) {
            // Levert ARRAY op die maar 1 element mag bevatten!
            $rootScope.selectedRow = filterFilter($scope.records, {'id':id});
            console.log('Id:' + id);
            window.location.href = "#/singleRow";
        }
    })

    .controller('singleRowCtrl', function($scope,$rootScope) {
        $scope.controllerName = 'singleRowCtrl';
        $scope.selectedRow    =  $rootScope.selectedRow[0]
        console.log('klaar');
    }
);