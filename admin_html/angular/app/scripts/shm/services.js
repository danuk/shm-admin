angular
  .module('shm_services', [
  ])
  .controller('ShmServicesController', ['$scope', function($scope) {
    'use strict';

    $scope.url = 'admin/services.cgi';

    $scope._columnDefs = [
        {field: 'user_id', displayName: 'ID'},
        {field: 'login', displayName: 'Логин' },
        {field: 'password', displayName: 'Пароль', visible: false},
        {field: 'full_name', displayName: 'Клиент'},
        {field: 'balance', displayName: 'Баланс'},
        {field: 'credit', displayName: 'Кредит'},
        {name: 'block'},
    ];
   
  }]);
