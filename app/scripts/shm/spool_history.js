angular
  .module('shm_spool_history', [
  ])
  .service('shm_spool_history', [ '$q', '$modal', 'shm_request', 'shm_console', function( $q, $modal, shm_request, shm_console ) {
    this.edit = function(row) {
        return $modal.open({
            templateUrl: 'views/spool_view.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Просмотр события';
                $scope.data = angular.copy(row);
                $scope.history_mode = 1;
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
  .controller('ShmSpoolHistoryController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_spool_history', function($scope, $modal, shm, shm_request, shm_spool_history) {
    'use strict';

    $scope.url = 'v1/admin/spool/history';

    $scope.columnDefs = [
        {
            field: 'executed',
            width: 150,
        },
        {
            field: 'user_id',
            width: 100,
            filter: { term: $scope.user.user_id }
        },
        {
            field: 'event.name',
            displayName: 'event',
            width: 100,
        },
        {
            field: 'event.title',
            displayName: 'title',
            width: 150,
        },
        {
            field: 'status',
            width: 100,
        },
        {field: 'response'},
    ];

    $scope.row_dbl_click = function(row) {
        shm_spool_history.edit(row);
    }

  }]);
