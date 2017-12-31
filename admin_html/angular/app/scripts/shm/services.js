angular
  .module('shm_services', [
  ])
  .controller('ShmServicesController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/services.cgi';

    $scope.columnDefs = [
        {field: 'service_id'},
        {field: 'name'},
        {field: 'category'},
        {field: 'cost', displayName: 'Цена'},
    ];
   
  }]);
