angular
    .module('shm_promo', [
    ])
    .service('shm_promo', [ '$modal', 'shm_request', function( $modal, shm_request ) {
        this.edit = function(row) {
            return $modal.open({
                templateUrl: 'views/promo_view.html',
                controller: function ($scope, $modalInstance, $modal) {
                    $scope.title = 'Просмотр промокода';
                    $scope.data = angular.copy(row);
                    $scope.obj = {
                        options: { mode: 'code' },
                    }
                    $scope.save = function () {
                        shm_request('POST_JSON', 'v1/admin/promo/' + $scope.data.id, $scope.data).then(function (response) {
                            angular.extend($scope.data, response.data);
                            $modalInstance.close(response.data);
                        }).catch(function (error) {
                            console.error('Failed to save promo code:', error);
                        });
                    };
                    $scope.delete = function () {
                        if ( confirm('Удалить промокод?') ) {
                            shm_request('DELETE', 'v1/admin/promo/'+ $scope.data.id ).then(function() {
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

        this.add = function(scope) {
            return $modal.open({
                templateUrl: 'views/promo_add.html',
                controller: function ($scope, $modalInstance, $modal) {
                    $scope.title = 'Генерировать промокод';
                    $scope.data = {
                        count: 1,
                        length: 10,
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.generate = function () {
                        var args = {
                            template_id: $scope.data.settings.template_id,
                            count: $scope.data.count,
                            length: $scope.data.length,
                            prefix: $scope.data.prefix,
                            settings: $scope.data.settings,
                        };
                        shm_request('PUT_JSON', 'v1/admin/promo', args, { withCredentials: true } ).then(function(response) {
                            angular.extend( $scope.data, response.data.data[0] );
                            $modalInstance.close( response.data.data[0] );
                        });
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
                width: 100,
            },
            {
                field: 'created',
                displayName: 'Дата создания',
                width: 150,
            },
            {
                field: 'settings',
            },
        ];

        $scope.row_dbl_click = function(row) {
            shm_promo.edit(row).result.then(function(data){
                angular.extend( row, data );
            }, function(resp) {
                if ( resp === 'delete' ) {
                    $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
                }
            });
        }

        $scope.add = function() {
            shm_promo.add($scope);
        };
    }]);