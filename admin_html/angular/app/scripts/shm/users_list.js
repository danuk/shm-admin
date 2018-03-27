angular
  .module('shm_users_list', [
  ])
  .controller('ShmUsersListController',
  ['$scope','$location','$route', function($scope, $location, $route) {
    'use strict';

    $scope.url = 'admin/users.cgi';

    $scope.columnDefs = [
        {field: 'user_id', displayName: 'ID'},
        {field: 'login', displayName: 'Логин' },
        {field: 'full_name', displayName: 'Клиент'},
        {field: 'balance', displayName: 'Баланс'},
    ];

    $scope.row_dbl_click = function(row) {
        angular.extend( $scope.user, row );
        $location.path('/user');
    }
}]);

