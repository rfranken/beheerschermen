/**
 * Created by Roel on 15-9-2015.
 */
// Service gegevens op uit file:
angular.module('fine.beheer')
    .service('dataService', function ($http) {
        this.getData = function (tabel) {
            return $http.get('json\/' + tabel+'.json');
        }
;    })