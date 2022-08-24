angular
  .module('shm_events_us', [
    'shm_events_us_list',
  ])
  .service('shm_events_us', [ '$q', '$modal', 'shm_request', 'shm_console', function( $q, $modal, shm_request, shm_console ) {
    var url = 'v1/admin/service/event';

    this.add = function(data) {
        var deferred = $q.defer();
        this.service_editor('Создание события', data, 'lg').result.then(function(data){
            shm_request('PUT_JSON', url, data ).then(function(response) {
                var row = response.data;
                deferred.resolve(response.data.data[0]);
            });
        }, function(cancel) {
            deferred.reject();
        });
        return deferred.promise;
    };

    this.service_editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/events_us_edit.html',
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
  .controller('ShmEventsUsController', ['$scope', '$modal', 'shm', 'shm_request','shm_events_us', function($scope, $modal, shm, shm_request, shm_events_us) {
    'use strict';
    var url = 'v1/admin/service/event';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'title',
        },
        {
            field: 'name',
            displayName: 'event',
        },
        {
            field: 'settings.category',
            displayName: 'category',
        },
    ];

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON', url, save_data ).then(function(response) {
            angular.extend( row, response.data );
        });
    };

    $scope.add = function() {
        var row = {
            next: null,
        };

        shm_events_us.add().then(function(row) {
            row.$$treeLevel = 0;
            $scope.gridOptions.data.push( row );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_events_us.service_editor('Редактирование события', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE', url, { id: row.id } ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }

  }]);

