angular
  .module('shm_bonuses', [
  ])
  .service('shm_bonuses', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.make_bonus = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/make_bonus.html',
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
  .controller('ShmBonusesController', ['$scope', '$modal', 'shm', 'shm_request','shm_bonuses', function($scope, $modal, shm, shm_request, shm_bonuses ) {
    'use strict';

    var url = 'v1/admin/user/bonus';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'user_id',
            displayName: "UID",
            filter: { term: $scope.user.user_id },
            width: 80,
        },
        {
            field: 'date',
            displayName: "Дата",
            width: 140,
        },
        {
            field: 'bonus',
            displayName: "Сумма",
            width: 80,
        },
        {
            field: 'comment',
        },
    ];


    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON', url, save_data ).then(function(response) {
            angular.extend( row, response.data.data[0] );
        });
    };

    $scope.add = function() {
        var row = {
            next: null,
            user_id: $scope.user.user_id || null,
        };

        shm_bonuses.make_bonus('Начислить бонусы', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/v1/admin/user/bonus', data ).then(function(response) {
                var row = response.data.data[0];

                row.$$treeLevel = 0;
                $scope.gridOptions.data.push( row );
            });
        }, function(cancel) {
        });
    };

  }]);

