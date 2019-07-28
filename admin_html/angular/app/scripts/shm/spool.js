angular
  .module('shm_spool', [
  ])
  .service('shm_spool', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.edit = function(row) {
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
    };
  }])
  .controller('ShmSpoolController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_spool', function($scope, $modal, shm, shm_request,shm_spool) {
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
        shm_spool.edit(row);
    }

  }]);
