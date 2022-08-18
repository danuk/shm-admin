angular
  .module('shm_templates', [
  ])
  .service('shm_templates', ['$modal', 'shm', 'shm_request', function($modal, shm, shm_request) {
    this.edit = function(row, title) {
        return $modal.open({
            templateUrl: 'views/template_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title || 'Редактирование услуги';
                $scope.data = angular.copy(row);
                $scope.data.is_add = row.id ? 0 : 1;

                $scope.id_pattern = '\\w+';

                var url = 'v1/admin/template';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function (is_test) {
                    shm_request( $scope.data.is_add ? 'PUT_JSON' : 'POST_JSON', url, $scope.data ).then(function(response) {
                        angular.extend( row, response.data.data[0] );
                        if (!is_test) $modalInstance.close( response.data.data[0] );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { id: row.id } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

                $scope.test = function () {
                    $scope.save(1);
                    $modal.open({
                        templateUrl: 'views/template_test.html',
                        controller: function ($scope, $modalInstance, $modal) {
                            $scope.data = angular.copy(row);

                            $scope.close = function () {
                                $modalInstance.dismiss('close');
                            };

                            $scope.render = function () {
                                var args = {
                                    user_id: $scope.data.user_id,
                                    usi: $scope.data.usi,
                                    dry_run: 1,
                                };
                                shm_request( 'GET', 'v1/template/'+ $scope.data.id, args ).then(function(response) {
                                    $scope.data.render = response.data.data[0];
                                });
                            };
                        },
                    });
                };
            },
            size: 'lg',
        });
    };

  }])
  .controller('ShmTemplatesController', ['$scope', 'shm_templates', function($scope, shm_templates) {
    'use strict';

    var url = 'v1/admin/template';
    $scope.url = url;
    $scope.parent_key_id = 'id';

    $scope.columnDefs = [
        {
            field: 'id',
            width: 200,
        },
        {
            field: 'title',
        },
    ];

    $scope.add = function() {
        var row = {
            next: null,
            period_cost: 1,
            cost: 0,
        };

        shm_templates.edit(row, 'Создание шаблона').result.then(function(data){
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_templates.edit(row).result.then(function(data){
            delete row.$$treeLevel;
            angular.extend( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
