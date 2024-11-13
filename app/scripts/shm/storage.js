angular
  .module('shm_storage', [
  ])
  .service('shm_storage', [ '$q', '$modal', '$window', 'shm_request', function( $q, $modal, $window, shm_request ) {
    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/storage_view.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                shm_request('GET', 'v1/storage/manage/' + row.name, { user_id: row.user_id } ).then(function(response) {
                    $scope.data.data = response.data;
                });

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.delete = function () {
                    if ( confirm('Удалить запись?') ) {
                        $modalInstance.dismiss('delete');
                    }
                };

                $scope.close = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.download = function () {
                    $window.open('shm/v1/storage/manage/' + row.name + '?format=other&user_id=' + row.user_id, '_blank');
                }
            },
            size: size,
        });
    };
  }])
  .controller('ShmStorageController', ['$scope', '$modal', 'shm', 'shm_request','shm_storage', function($scope, $modal, shm, shm_request, shm_storage ) {
    'use strict';

    var url = 'v1/admin/storage/manage';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'user_id',
            displayName: "UID",
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
                shm_request('DELETE', url + '/' + row.name, { user_id: row.user_id } ).then(function(response) {
                    $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf( row ), 1);
                })
            }
        });
    }

    var save_service = function( row, save_data ) {
        shm_request('POST_JSON', url + '/' + row.name, { data: save_data.data, user_id: row.user_id } ).then(function(response) {
            angular.extend( row, response.data.data[0] );
        });
        delete save_data.$$treeLevel;
    };

  }]);

