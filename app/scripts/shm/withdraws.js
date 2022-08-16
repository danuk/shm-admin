angular
  .module('shm_withdraws', [
  ])
  .controller('ShmWithdrawsController', ['$scope', '$modal', 'shm', 'shm_request', function($scope, $modal, shm, shm_request) {
    'use strict';

    var url = 'v1/admin/user/service/withdraw';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'user_id',
            width: 80,
            filter: { term: $scope.user.user_id },
        },
        {field: 'name', displayName: "Услуга"},
        {field: 'create_date', displayName: "Дата создания"},
        {field: 'withdraw_date', displayName: "Дата списания"},
        {field: 'total', displayName: "Итого"},
    ];

    $scope.service_editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/withdraw_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
                };

            },
            size: size,
        });
    }

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON', url, save_data ).then(function(response) {
            var new_data = response.data.data[0];

            angular.extend( row, new_data );
        });
    };

    $scope.add = function() {
        var row = {
            next: null,
        };

        $scope.service_editor('Создание', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON', url, data ).then(function(response) {
                var row = response.data.data[0];

                row.$$treeLevel = 0;
                $scope.gridOptions.data.push( row );
            });
        }, function(cancel) {
        });
    };

  }]);

