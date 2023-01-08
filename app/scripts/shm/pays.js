angular
  .module('shm_pays', [
  ])
  .service('shm_pays', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.make_pay = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/make_pay.html',
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
  .controller('ShmPaysController', ['$scope', '$modal', 'shm', 'shm_request','shm_pays', function($scope, $modal, shm, shm_request, shm_pays ) {
    'use strict';

    var url = 'v1/admin/user/pay';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'user_id',
            filter: { term: $scope.user.user_id },
            width: 80,
        },
        {
            field: 'date',
            displayName: "Дата",
            width: 140,
        },
        {
            field: 'money',
            displayName: "Сумма",
            width: 80,
        },
        {
            field: 'pay_system_id',
            width: 100,
        },
        {
            field: 'comments',
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

        shm_pays.make_pay('Принять платеж', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/v1/admin/user/payment', data ).then(function(response) {
                var row = response.data.data[0];

                row.$$treeLevel = 0;
                $scope.gridOptions.data.push( row );
            });
        }, function(cancel) {
        });
    };

  }]);

