angular
  .module('shm_servers_groups', [
  ])
  .controller('ShmServersGroupsController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/servers_groups.cgi';

    $scope.columnDefs = [
        {field: 'group_id'},
        {field: 'name', displayName: 'Группа' },
        {field: 'type'},
    ];
   
  }]);
