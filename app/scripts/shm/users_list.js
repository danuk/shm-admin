angular
  .module('shm_users_list', [
  ])
  .controller('ShmUsersListController',
  ['$scope', '$modal', '$location','$route', 'shm_request', function($scope, $modal, $location, $route, shm_request) {
    'use strict';

    $scope.url = 'v1/admin/user';

    $scope.columnDefs = [
        {
            field: 'user_id',
            displayName: 'UID',
            width: 65,
            filter: {},
        },
        {
            field: 'login',
            displayName: 'Логин',
            width: 150,
            filter: {},
        },
        {
            field: 'full_name',
            displayName: 'Клиент',
            filter: {},
        },
        {
            field: 'balance',
            displayName: 'Баланс',
            width: 100,
            filter: {},
        },
        {
            field: 'bonus',
            displayName: 'Бонусы',
            width: 100,
            filter: {},
        },
        {
            field: 'settings',
            displayName: 'Settings',
            width: 300,
            filter: {
                condition: function() { return true },
            },
        },
    ];

    $scope.defaultFilter = {
        block: 0,
    };

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
            shm_request('PUT_JSON','/v1/user', user ).then(function(row) {
                $scope.gridOptions.data.push( row.data.data[0] );
            })
        }, function(cancel) {
        });
    };

 }]);

