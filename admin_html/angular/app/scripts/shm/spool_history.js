angular
  .module('shm_spool_history', [
  ])
  .controller('ShmSpoolHistoryController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/spool_history.cgi';

    $scope.columnDefs = [
        {field: 'id'},
        {field: 'user_id'},
        {field: 'user_service_id'},
        {field: 'status'},
        {field: 'responce'},
        {field: 'executed'},
    ];
   
  }]);
