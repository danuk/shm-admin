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
            field: 'user_id',
            width: 150,
        },
        {
            field: 'event.kind',
            displayName: 'kind',
            width: 150,
        },
        {
            field: 'event.title',
            displayName: 'event',
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
                   options: { mode: 'code' },
                }

                $scope.show_user_service = 0;
                if ( $scope.data.params ) $scope.show_user_service = $scope.data.params.user_service_id;

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
