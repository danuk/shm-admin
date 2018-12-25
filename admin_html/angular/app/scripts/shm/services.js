angular
  .module('shm_services', [
  ])
  .controller('ShmServicesController', ['$scope', '$modal', 'shm', 'shm_request', function($scope, $modal, shm, shm_request) {
    'use strict';

    var url = 'admin/services.cgi';
    $scope.url = url;

    $scope.parent_key_id = 'service_id';

    $scope.columnDefs = [
        {field: 'service_id'},
        {field: 'name'},
        {field: 'category'},
        {field: 'cost', displayName: 'Цена'},
    ];

    $scope.service_editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/service_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);
                $scope.data.children = [];
                
                // Load all services
                shm_request('GET','/'+url).then(function(data) {
                    $scope.services = data;
                });

                // Load childs
                if ( row.service_id ) {
                    shm_request('GET','/'+url, { parent: row.service_id } ).then(function(data) {
                        $scope.data.children = data;
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
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
            next: null,
        };

        $scope.service_editor('Создание услуги', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/'+url, data ).then(function(row) {
                row.$$treeLevel = 0;
                $scope.gridOptions.data.push( row );
            });
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        $scope.service_editor('Редактирование услуги', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE','/'+url+'?service_id='+row.service_id ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }

  }]);
