'use strict';

// Declare app level module which depends on views, and components
angular.module('fine.beheer', ['ngRoute','ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/landen/MR', {
                templateUrl: 'schermen/landen/MRdefaultView.html',
                controller: 'multiRowCtrl'
            })
            .when('/landen/SR', {
                templateUrl: 'schermen/landen/SRdefaultView.html',
                controller: 'singleRowCtrl'
            })
            .when('/constanten/MR', {
                templateUrl: 'schermen/constanten/MRdefaultView.html',
                controller: 'multiRowCtrl'
            })
            .when('/constanten/SR', {
                templateUrl: 'schermen/constanten/SRdefaultView.html',
                controller: 'singleRowCtrl'
            })
            .otherwise({redirectTo: '/landen/MR'});
    }])



    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    })

    .controller('multiRowCtrl', function ($scope, filterFilter,dataService,$rootScope) {
        $scope.readingFromDatabase=true;
        // afleiden van het pad:
        var  urlNum = window.location.href.split('/');
        // Het zesde element bevat de tabelnaam en dus de naam voor de service.
        // vb:
        // ["http:", "", "localhost:63342", "fine.beheer", "app", "index.html#", "constanten", "MR"]
        dataService.getData(urlNum[6])
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
            // De schoonheidsprijs verdient het niet omhoog en omlaag lijkt niet te lukken:
            window.location.href = window.location.href.replace('/MR','/SR')
        }
    })

    .controller('singleRowCtrl', function($scope,$rootScope) {
        $scope.controllerName = 'singleRowCtrl';
        $scope.selectedRow    =  $rootScope.selectedRow[0]
        console.log('klaar');
    }
);