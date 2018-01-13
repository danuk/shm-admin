angular
  .module('shm_spool', [
  ])
  .controller('ShmSpoolController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/spool.cgi';

    $scope.columnDefs = [
        {field: 'id'},
        {field: 'user_id'},
        {field: 'user_service_id'},
        {field: 'status'},
        {field: 'created'},
        {field: 'delayed'},
        {field: 'responce'},
    ];
   
  }]);
