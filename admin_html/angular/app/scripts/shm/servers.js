angular
  .module('shm_servers', [
    'shm_transports_list',
    'shm_servers_groups_list',
    'shm_identities_list',
  ])
  .service('shm_servers', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.add = function(data) {
        var deferred = $q.defer();

        this.editor('Создание сервера', data, 'lg').result.then(function(new_data){
            shm_request('PUT_JSON', '/admin/server.cgi', new_data ).then(function(row) {
                deferred.resolve(row);
            });
        }, function(cancel) {
            deferred.reject();
        });
        return deferred.promise;
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/servers_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                $scope.servers_list = [];

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.test_ssh = function() {
                    shm_request('POST_JSON', '/admin/ssh_test.cgi', $scope.data ).then(function(data) {
                        if ( data.result.ret_code != 0 ) {
                            alert( "Error: " + data.result.error );
                        } else {
                            alert( "Successful: " + data.result.data );
                        }
                    });
                }

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
                };
            },
            size: size,
        });
    }
  }])
  .controller('ShmServersController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_servers', function($scope, $modal, shm, shm_request, shm_servers ) {
    'use strict';

    var url = '/admin/server.cgi';
    $scope.url = url;

    $scope.columnDefs = [
        {field: 'server_id'},
        {field: 'name', displayName: 'Имя' },
        {field: 'host'},
        {field: 'ip'},
        {field: 'transport'},
    ];

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON','/'+url, save_data ).then(function(new_data) {
            angular.extend( row, new_data );
        });
    };

    $scope.add = function() {
        shm_servers.add().then(function(row) {
            row.$$treeLevel = 0;
            $scope.gridOptions.data.push( row );
        }, function(cancel) {
        });
    }

    $scope.row_dbl_click = function(row) {
        shm_servers.editor('Редактирование сервера', row, 'lg').result.then(function(data){
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
