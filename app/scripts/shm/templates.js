angular
  .module('shm_templates', [
  ])
  .service('shm_templates', ['$q', '$modal', 'shm', 'shm_request', function($q, $modal, shm, shm_request) {
    var url = 'v1/admin/template';

    this.add = function() {
        var deferred = $q.defer();

        this.edit('Создание шаблона', {}, 'lg').result.then(function(new_data){
            deferred.resolve(new_data);
        }, function(cancel) {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.edit = function(title, row, scope) {
        return $modal.open({
            templateUrl: 'views/template_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);
                $scope.data.is_add = row.id ? 0 : 1;

                $scope.id_pattern = '[A-Za-z0-9-_]+';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function (is_test) {
                    shm_request( $scope.data.is_add ? 'PUT_JSON' : 'POST_JSON', url, $scope.data ).then(function(response) {
                        $scope.data.is_add = 0;
                        angular.extend( row, response.data.data[0] );
                        if (!is_test) $modalInstance.close( response.data.data[0] );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { id: row.id } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

                $scope.test = function (template_id) {
                    $scope.save(1);
                    $modal.open({
                        templateUrl: 'views/template_test.html',
                        controller: function ($scope, $modalInstance, $modal) {
                            $scope.data = angular.copy(row);
                            $scope.data.user_id = scope.user.user_id || "1";

                            $scope.close = function () {
                                $modalInstance.dismiss('close');
                            };

                            $scope.render = function () {
                                var args = {
                                    user_id: $scope.data.user_id,
                                    usi: $scope.data.usi,
                                    dry_run: 1,
                                    format: 'default',
                                };
                                shm_request( 'GET', 'v1/template/'+ template_id, args ).then(function(response) {
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
  .controller('ShmTemplatesController', ['$scope', 'shm_templates', 'shm_request', function($scope, shm_templates, shm_request) {
    'use strict';

    var url = 'v1/admin/template';
    $scope.url = url;
    $scope.parent_key_id = 'id';

    $scope.columnDefs = [
        {
            field: 'id',
            width: "100%",
        },
    ];

    $scope.add = function() {
        shm_templates.add().then(function(data) {
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_templates.edit('Редактирование шаблона',row, $scope).result.then(function(data){
            shm_request('POST_JSON', url, data ).then(function(response) {
                angular.extend( row, response.data.data[0] );
                delete row.$$treeLevel;
            });
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
