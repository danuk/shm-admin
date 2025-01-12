angular
  .module('shm_withdraws', [
      'shm_services',
  ])
  .service('shm_withdraws', [ '$q', '$modal', 'shm_request', 'shm_services', function( $q, $modal, shm_request, shm_services ) {
    this.edit = function (row) {
        return $modal.open({
            templateUrl: 'views/withdraw_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Редактирование списания';
                $scope.data = row;
                $scope.wd = angular.copy( row );

                $scope.$watch('wd', function(newValue, oldValue){
                    if (
                        newValue.cost != oldValue.cost ||
                        newValue.bonus != oldValue.bonus ||
                        newValue.months != oldValue.months ||
                        newValue.qnt != oldValue.qnt ||
                        newValue.discount != oldValue.discount
                    ) {
                        $scope.wd["dry_run"] = 1;
                        shm_request('POST_JSON', 'v1/admin/user/service/withdraw', $scope.wd ).then(function(response) {
                            var data = response.data.data[0];
                            $scope.wd.total = data.total;
                            $scope.wd.end_date = data.end_date;
                        })
                    }

                }, true);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $scope.wd["dry_run"] = 0;
                    shm_request('POST_JSON', 'v1/admin/user/service/withdraw', $scope.wd ).then(function(response) {
                        $modalInstance.close( response.data.data[0] );
                    })
                };

            },
            size: 'lg',
        });
    }

  }])
  .controller('ShmWithdrawsController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_withdraws', function($scope, $modal, shm, shm_request, shm_withdraws) {
    'use strict';

    var url = 'v1/admin/user/service/withdraw';
    $scope.url = url;

    $scope.columnDefs = [
        {
            field: 'user_id',
            displayName: "UID",
            width: 65,
            filter: { term: $scope.user.user_id },
        },
        {
            field: 'user_service_id',
            displayName: "USI",
            width: 65,
        },
        {
            field: 'name',
            displayName: "Услуга",
        },
        {field: 'withdraw_date', displayName: "Оплачена",width: 140},
        {field: 'cost', displayName: "Цена", width: 90},
        {field: 'qnt', displayName: "Кол-во", width: 90},
        {field: 'bonus', displayName: "Бонусы", width: 90},
        {field: 'discount', displayName: "Скидка", width: 90},
        {field: 'total', displayName: "Итого", width: 90},
    ];

    $scope.row_dbl_click = function(row) {
        shm_withdraws.edit(row).result.then(function(data){
            angular.extend( row, data );
        }, function(resp) {
        });
    }

  }]);

