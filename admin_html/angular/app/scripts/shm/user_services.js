angular
  .module('shm_user_services', [
  ])
  .service('shm_user_services', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.add = function(data) {
        return $modal.open({
            templateUrl: 'views/user_service_add.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Создание услуги пользователя';
                $scope.data = {
                    user_id: "-1",
                };
                $scope.service = {};

                $scope.$watch('service', function(newValue, oldValue){
                    $scope.data.service_id = newValue.service_id;
                    $scope.data.cost = newValue.cost;
                    $scope.data.period_cost = newValue.period_cost;
                    $scope.data.settings = newValue.config;
                });

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    shm_request('PUT_JSON', '/admin/create_user_service.cgi', $scope.data ).then(function(row) {
                        $modalInstance.close( row );
                    });
                };

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
                };

            },
            size: 'lg',
        });
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/user_service_edit.html',
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
  .controller('ShmUserServicesController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_user_services', function($scope, $modal, shm, shm_request, shm_user_services ) {
    'use strict';

    var url = 'admin/u_s_object.cgi';
    $scope.url = 'admin/user_services.cgi';
    $scope.parent_key_id = 'user_service_id';
    $scope.maxDeepLevel = 2;

    $scope.columnDefs = [
        {field: 'user_service_id', width: 120},
        {field: 'name'},
        {
            field: 'user_id',
            width: 100,
            filter: { term: $scope.user.user_id }
        },
        {field: 'status', width: 100},
        {field: 'expired'},
        {field: 'withdraws.cost', displayName: 'Цена'},
    ];

    var save_service = function( row, save_data ) {
        shm_request('POST_JSON','/'+url, save_data ).then(function(new_data) {
            angular.extend( row, new_data );
        });
    };

    $scope.add = function() {
        shm_user_services.add().result.then(function(row) {
            row.$$treeLevel = 0;
            $scope.gridOptions.data.push( row );
        }, function(resp) {
        });
    }

    $scope.row_dbl_click = function(row) {
        shm_user_services.editor('Редактирование услуги', row, 'lg').result.then(function(data){
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
