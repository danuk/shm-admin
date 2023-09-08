angular
  .module('shm_storage', [
  ])
  .service('shm_storage', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/storage_view.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                shm_request('GET', 'v1/storage/manage/' + row.name, { user_id: row.user_id } ).then(function(response) {
                    $scope.data.data = response.data;
                });

                $scope.close = function () {
                    $modalInstance.dismiss('cancel');
                };

            },
            size: size,
        });
    };
  }])
  .controller('ShmStorageController', ['$scope', '$modal', 'shm', 'shm_request','shm_storage', function($scope, $modal, shm, shm_request, shm_storage ) {
    'use strict';

    var url = 'v1/storage/manage';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'user_id',
            filter: { term: $scope.user.user_id },
            width: 80,
        },
        {
            field: 'name',
            displayName: "Название",
            width: 140,
        },
        {
            field: 'settings',
        },
    ];

    $scope.row_dbl_click = function(row) {
        shm_storage.editor('Данные хранилища', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
            }
        });
    }

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
    };

  }]);

