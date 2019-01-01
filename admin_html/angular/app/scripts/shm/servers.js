angular
  .module('shm_servers', [
      'shm_servers_groups_list',
  ])
  .controller('ShmServersController', ['$scope', '$modal', 'shm', 'shm_request', function($scope, $modal, shm, shm_request) {
    'use strict';

    var url = 'admin/server.cgi';
    $scope.url = url;

    $scope.columnDefs = [
        {field: 'server_id'},
        {field: 'name', displayName: 'Имя' },
        {field: 'host'},
        {field: 'ip'},
        {field: 'transport'},
    ];

    $scope.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/servers_edit.html',
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
        shm_request('POST_JSON','/'+url, save_data ).then(function(new_data) {
            angular.extend( row, new_data );
        });
    };

    $scope.add = function() {
        var row = {
            'transport': 'ssh',
        };

        $scope.editor('Создание сервера', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/'+url, data ).then(function(row) {
                row.$$treeLevel = 0;
                $scope.gridOptions.data.push( row );
            });
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        $scope.editor('Редактирование сервера', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE','/'+url+'?id='+row.server_id ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }

  }]);
