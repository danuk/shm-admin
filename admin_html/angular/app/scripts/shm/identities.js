angular
  .module('shm_identities', [
  ])
  .service('shm_identities', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.add = function(data) {
        var deferred = $q.defer();

        this.editor('Создание ключа', data, 'lg').result.then(function(new_data){
            shm_request('PUT_JSON','/admin/identities.cgi', new_data ).then(function(row) {
                deferred.resolve(row);
            });
        }, function(cancel) {
            deferred.reject();
        });
        return deferred.promise;
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/identities_edit.html',
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

  }])
  .controller('ShmIdentitiesController', ['shm_identities', '$scope', '$modal', 'shm', 'shm_request', function(shm_identities, $scope, $modal, shm, shm_request) {
    'use strict';

    var url = 'admin/identities.cgi';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'id',
            width: 100,
        },
        {
            field: 'name',
            width: 300,
        },
        {
            field: 'fingerprint',
        },
    ];

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON','/'+url, save_data ).then(function(new_data) {
            angular.extend( row, new_data );
        });
    };

    $scope.add = function() {
        shm_identities.add().then(function(row) {
            row.$$treeLevel = 0;
            $scope.gridOptions.data.push( row );
        }, function(cancel) {
        });
    }

    $scope.row_dbl_click = function(row) {
        shm_identities.editor('Редактирование ключа', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE','/'+url+'?id='+row.id ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }

  }]);
