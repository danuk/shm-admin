angular
  .module('shm_users', [
  ])
  .controller('ShmUsersController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/users.cgi';

    $scope.columnDefs = [
        {field: 'user_id', displayName: 'ID'},
        {field: 'login', displayName: 'Логин' },
        {field: 'full_name', displayName: 'Клиент'},
        {field: 'balance', displayName: 'Баланс'},
    ];

    $scope.row_dbl_click = function(row) {
        console.log('URA:', row );
        row.balance = 10000;
    }

  }]);

