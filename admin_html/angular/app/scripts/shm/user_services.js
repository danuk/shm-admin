angular
  .module('shm_user_services', [
    'angular-jsoneditor',
  ])
  .controller('ShmUserServicesController', ['$scope', '$modal', 'shm', function($scope, $modal, shm) {
    'use strict';

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
        //{field: 'cost', displayName: 'Цена'},
    ];

    $scope.service_editor = function (title, row, size) {
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

                $scope.editJson = function(data) {
                    shm.editJson(data).result.then(function(json) {
                        $scope.data.settings = json;
                    },function(cancel) {
                    })
                };
            },
            size: size,
        });
    }


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
