angular
    .module('shm_promo', [
    ])
    .service('shm_promo', [ '$modal', 'shm_request', '$window', function( $modal, shm_request, $window ) {
        this.add = function(scope) {
            return $modal.open({
                templateUrl: 'views/promo_add.html',
                controller: function ($scope, $modalInstance, $modal) {
                    $scope.data = {
                        settings: {
                            reusable: 0,
                            count: 1,
                            length: 10,
                            status: 1,
                            quantity: 1,
                            prefix: 'PROMO_',
                        },
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.generate = function () {
                        shm_request('PUT_JSON', 'v1/admin/promo', $scope.data ).then(function(response) {
                            angular.extend( $scope.data, response.data.data[0] );
                            $modalInstance.close( response.data.data[0] );
                        });
                    };
                },
                size: 'lg',
            });
        };
        this.edit = function(row) {
            return $modal.open({
                templateUrl: 'views/promo_view.html',
                controller: function ($scope, $modalInstance ) {
                    $scope.title = 'Просмотр промокода';
                    $scope.data = angular.copy(row);

                    if ( $scope.data.used_by) {
                        $scope.title += ' (использован)';
                    }

                    $scope.save = function () {
                        shm_request('POST_JSON', 'v1/admin/promo', $scope.data ).then(function (response) {
                            angular.extend($scope.data, response.data);
                            $modalInstance.close(response.data);
                        }).catch(function (error) {
                            console.error('Failed to save promo code:', error);
                        });
                    };
                    $scope.delete = function () {
                        if ( confirm('Удалить промокод?') ) {
                            shm_request('DELETE', 'v1/admin/promo', { user_id: $scope.data.user_id, id: $scope.data.id } ).then(function() {
                                $modalInstance.dismiss('delete');
                            })
                        }
                    };
                    $scope.close = function () {
                        $modalInstance.close( $scope.data );
                    };
                },
                size: 'lg',
            });
        };
    }])
    .controller('ShmPromoController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_promo', function($scope, $modal, shm, shm_request, shm_promo) {
        'use strict';

        $scope.url = 'v1/admin/promo';

        $scope.columnDefs = [
            {
                field: 'user_id',
                displayName: 'UID',
                width: 100,
            },
            {
                field: 'id',
                displayName: 'Промокод',
                width: 200,
            },
            {
                field: 'template_id',
                displayName: 'Шаблон',
                width: 150,
            },
            {
                field: 'created',
                displayName: 'Дата создания',
                width: 150,
            },
            {
                field: 'used_by',
                width: 150,
            },
            {
                field: 'expire',
            },
        ];

        $scope.row_dbl_click = function(row) {
            shm_promo.edit(row).result.then(function(data){
                angular.extend( row, data );
                $scope.load_data($scope.url);
            }, function(resp) {
                if ( resp === 'delete' ) {
                    $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
                }
            });
        };

        $scope.add = function() {
            shm_promo.add().result.then(function() {
                $scope.load_data($scope.url);
            });
        };
    }]);