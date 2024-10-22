angular
  .module('shm_services', [
  ])
  .service('shm_services', ['$modal', 'shm', 'shm_request', function($modal, shm, shm_request) {
    this.edit = function(row, title) {
        return $modal.open({
            templateUrl: 'views/service_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title || 'Редактирование услуги';
                $scope.data = angular.copy(row);
                $scope.data.deleted = 0;
                $scope.data.once_service = ($scope.data.period == 0 && $scope.data.next == -1);
                var url = 'v1/admin/service';

                // Load all services
                shm_request('GET', url, { limit: 0 } ).then(function(response) {
                    $scope.services = response.data.data;
                });

                // Load childs
                if ( row.service_id ) {
                    shm_request('GET', url + '/children', {
                        service_id: row.service_id,
                    } ).then(function(response) {
                        $scope.data.children = response.data.data;
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    if ( $scope.data.once_service ) {
                        $scope.data.period = 0;
                        $scope.data.next = -1;
                    };
                    shm_request( $scope.data.service_id ? 'POST_JSON' : 'PUT_JSON', url, $scope.data ).then(function(response) {
                        $modalInstance.close( response.data.data[0] );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { service_id: row.service_id } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

                $scope.editSubServices = function(service_id) {
                    shm.list_choises({
                        title: 'Управление дочерними услугами',
                        list_caption_field: 'name',
                        label_from: 'Услуги',
                        services: $scope.services,
                        label_to: 'Дочерние услуги',
                        service_id: $scope.data.service_id,
                    }).result.then(function(data){
                    },function(cancel) {
                    });
                };
            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmServicesController', ['$scope', 'shm_services', function($scope, shm_services) {
    'use strict';

    var url = 'v1/admin/service';
    $scope.url = url;
    $scope.parent_key_id = 'service_id';

    $scope.columnDefs = [
        {
            field: 'service_id',
            displayName: 'SI',
            width: 100,
        },
        {
            field: 'name',
            width: 500,
        },
        {field: 'category'},
        {field: 'cost', displayName: 'Цена'},
    ];

    $scope.add = function() {
        var row = {
            next: null,
            period: 1,
            cost: 0,
        };

        shm_services.edit(row, 'Создание услуги').result.then(function(data){
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_services.edit(row).result.then(function(data){
            angular.extend( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
