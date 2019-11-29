angular
  .module('shm_config', [
  ])
  .service('shm_config', ['$modal', 'shm', 'shm_request', function($modal, shm, shm_request) {
    this.edit = function(row, title) {
        return $modal.open({
            templateUrl: 'views/config_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title || 'Редактирование';
                $scope.data = angular.copy(row);

                var url = 'admin/config.cgi';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    shm_request( $scope.data.id ? 'POST_JSON' : 'PUT_JSON','/'+url, $scope.data ).then(function(responce) {
                        $modalInstance.close( responce.data );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE','/'+url+'?id='+row.id ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmConfigController', ['$scope', 'shm_config', function($scope, shm_config) {
    'use strict';

    var url = 'admin/config.cgi';
    $scope.url = url;
    $scope.parent_key_id = 'id';

    $scope.columnDefs = [
        {
            field: 'id',
            width: 100,
        },
        {
            field: 'name',
            width: 200,
        },
        {
            field: 'data',
        },
    ];

    $scope.add = function() {
        var row = {};

        shm_config.edit(row, 'Создание параметра').result.then(function(data){
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_config.edit(row).result.then(function(data){
            delete row.$$treeLevel;
            angular.extend( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
