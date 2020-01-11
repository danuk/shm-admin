angular
  .module('shm_spool_history', [
  ])
  .service('shm_spool', [ '$q', '$modal', 'shm_request', 'shm_console', function( $q, $modal, shm_request, shm_console ) {
    this.edit = function(row) {
        return $modal.open({
            templateUrl: 'views/spool_view.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Просмотр события';
                $scope.data = angular.copy(row);
                $scope.obj = {
                   options: { mode: 'code' },
                }

                $scope.show_user_service = 0;
                if ( $scope.data.settings ) $scope.show_user_service = $scope.data.settings.user_service_id;

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.close = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.retry = function () {
                    shm_request('POST_JSON', '/admin/spool.cgi?method=manual_retry', $scope.data ).then(function(response) {
                        angular.extend( $scope.data , response.data );
                    });
                };

                $scope.console = function() {
                    var pipeline_id = $scope.data.response.pipeline_id;
                    shm_console.log( pipeline_id ).result.then(function(){
                    }, function(cancel) {
                    });
                }
            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmSpoolHistoryController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_spool', function($scope, $modal, shm, shm_request, shm_spool) {
    'use strict';

    $scope.url = 'admin/spool_history.cgi';

    $scope.columnDefs = [
        {
            field: 'executed',
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
