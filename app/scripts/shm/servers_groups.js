angular
  .module('shm_servers_groups', [
    'shm_servers_types_list',
  ])
  .service('shm_servers_groups', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {

    var url = 'v1/admin/server/group';
    this.url = url;

    this.add = function(data) {
        var deferred = $q.defer();

        this.editor('Создание группы', data, 'lg').result.then(function(new_data){
            shm_request('PUT_JSON', url, new_data ).then(function(response) {
                deferred.resolve(response.data.data[0]);
            });
        }, function(cancel) {
            deferred.reject();
        });
        return deferred.promise;
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/servers_groups_edit.html',
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
  .controller('ShmServersGroupsController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_servers_groups', function($scope, $modal, shm, shm_request, shm_servers_groups) {
    'use strict';

    $scope.url = shm_servers_groups.url;

    $scope.columnDefs = [
        {field: 'group_id'},
        {field: 'name', displayName: 'Группа' },
        {field: 'type'},
    ];

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON', $scope.url, save_data ).then(function(response) {
            angular.extend( row, response.data.data[0] );
        });
    };

    $scope.add = function() {
        var row = {};

        shm_servers_groups.add().then(function(row) {
            row.$$treeLevel = 0;
            $scope.gridOptions.data.push( row );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_servers_groups.editor('Редактирование группы', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE', $scope.url+'?id='+row.group_id ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }
  }]);
