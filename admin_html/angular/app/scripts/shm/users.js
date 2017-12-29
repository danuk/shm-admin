angular
  .module('shm_users', [
  ])
  .controller('ShmUsersController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/users.cgi';

    $scope.columnDefs = [
        {field: 'user_id', displayName: 'ID'},
        {field: 'login', displayName: 'Логин' },
        //{field: 'login', displayName: 'Логин', cellTemplate: '<button ng-click="grid.appScope.test(row.entity)" >Edit</button>'},
        {field: 'password', displayName: 'Пароль', visible: false},
        {field: 'full_name', displayName: 'Клиент'},
        {field: 'balance', displayName: 'Баланс'},
        {field: 'credit', displayName: 'Кредит'},
        {name: 'block'},
    ];
   
  }]);
