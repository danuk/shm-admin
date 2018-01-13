angular
  .module('shm_categories', [
  ])
  .controller('ShmCategoriesController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/services_commands.cgi';

    $scope.columnDefs = [
        {field: 'category'},
        {field: 'event'},
        {field: 'group_name'},
        {field: 'type'},
    ];


    $scope.row_dbl_click = function(row) {
        console.log('URA:', row );
    }

  }]);

