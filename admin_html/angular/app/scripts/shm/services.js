angular
  .module('shm_services', [
    'angular-jsoneditor',
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

    $scope.openModal = function (title, row, size) {
        var modalInstance = $modal.open({
            templateUrl: 'edit.tmpl',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);
                $scope.data.children = [];
                
                // Load childs
                shm_request('GET','/'+url, { parent: row.service_id } ).then(function(data) {
                    $scope.data.children = data;
                });

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.editJson = function(data) {
                    shm.editJson(data).result.then(function(json) {
                        $scope.data.config = json;
                    })
                };

                $scope.editSubServices = function(service_id,children) {
                    shm_request('GET','/'+url).then(function(data) {
                        $scope.data.services = data;
                        shm.list_choises({
                            title: 'Управление дочерними услугами',
                            list_caption_field: 'name',
                            label_from: 'Услуги',
                            list_from: $scope.data.services,
                            label_to: 'Дочерние услуги',
                            list_to: $scope.data.children,
                        }).then(function(data){
                            $scope.data.children = data;
                        });
                    });
                };
            },
            size: size,
        });
    }
  
    $scope.row_dbl_click = function(row) {
        $scope.openModal('Редактирование услуги', row, 'lg');
    }

  }]);
