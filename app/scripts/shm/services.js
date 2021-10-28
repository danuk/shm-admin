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
                $scope.data.children = [];
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
                    var children = [];
                    for ( var item in $scope.data.children ) {
                        children.push(  $scope.data.children[item].service_id );
                    }
                    $scope.data.children = children;

                    shm_request( $scope.data.service_id ? 'POST_JSON' : 'PUT_JSON', url, $scope.data ).then(function(response) {
                        $modalInstance.close( response.data.data[0] );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { id: row.service_id } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

                $scope.editSubServices = function(service_id,children) {
                    shm.list_choises({
                        title: 'Управление дочерними услугами',
                        list_caption_field: 'name',
                        label_from: 'Услуги',
                        list_from: $scope.services,
                        label_to: 'Дочерние услуги',
                        list_to: $scope.data.children,
                    }).result.then(function(data){
                        $scope.data.children = data.list_to;
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
            period_cost: 1,
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
