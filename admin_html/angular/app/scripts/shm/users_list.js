angular
  .module('shm_users_list', [
  ])
  .controller('ShmUsersListController',
  ['$scope', '$modal', '$location','$route', 'shm_request', function($scope, $modal, $location, $route, shm_request) {
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

    $scope.user_add = function (title, row, size) {
        return $modal.open({
            templateUrl: 'user_add.tmpl',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };
            },
            size: size,
        });
    }
    $scope.add = function() {
        $scope.user_add('Создание пользователя', null, 'lg').result.then(function(user){
            console.log( user );
            shm_request('PUT_JSON','/admin/user.cgi', user ).then(function(row) {
                $scope.gridOptions.data.push( row );
            })
        }, function(cancel) {
        });
    };

 }]);

