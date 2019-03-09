angular
  .module('shm_spool', [
  ])
  .controller('ShmSpoolController', ['$scope', '$modal', 'shm', 'shm_request', function($scope, $modal, shm, shm_request) {
    'use strict';

    $scope.url = 'admin/spool.cgi';

    $scope.columnDefs = [
        {
            field: 'created',
            width: 150,
        },
        {
            field: 'user_service_id',
            width: 150,
        },
        {
            field: 'status',
            width: 100,
        },
        {field: 'response'},
    ];

    $scope.row_dbl_click = function(row) {
        return $modal.open({
            templateUrl: 'views/spool_view.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Просмотри события';
                $scope.data = angular.copy(row),
                $scope.obj = {
                   data: angular.copy(row.response),
                   options: { mode: 'code' },
                }

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.close = function () {
                    $modalInstance.close( $scope.data );
                };
            },
            size: 'lg',
        });
    }

  }]);
