angular
  .module('shm_templates', [
  ])
  .service('shm_templates', ['$q', '$modal', 'shm', 'shm_request', function($q, $modal, shm, shm_request) {
    var url = 'v1/admin/template';

    this.add = function($scope) {
        var deferred = $q.defer();

        this.edit('Создание шаблона', {}, $scope).result.then(function(new_data){
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
                $scope.data = {};
                $scope.data.is_add = row.id ? 0 : 1;

                if ( row.id ) {
                    // reload opened template
                    shm_request( 'GET', 'v1/admin/template?id='+ row.id ).then(function(response) {
                        angular.extend( $scope.data, response.data.data[0] );
                    });
                };

                $scope.id_pattern = '[A-Za-z0-9-_/]+';

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
                    if ( confirm('Удалить шаблон?') ) {
                        shm_request('DELETE', url, { id: row.id } ).then(function() {
                            $modalInstance.dismiss('delete');
                        })
                    }
                };

                $scope.test = function (template_id) {
                    $scope.save(1);
                    $modal.open({
                        templateUrl: 'views/template_test.html',
                        controller: function ($scope, $modalInstance, $modal) {
                            $scope.data = angular.copy(row);
                            $scope.data.user_id = scope.user.user_id || "1";
                            $scope.data.dry_run = 1;

                            $scope.close = function () {
                                $modalInstance.dismiss('close');
                            };

                            $scope.render = function () {
                                var args = {
                                    user_id: $scope.data.user_id,
                                    usi: $scope.data.usi,
                                    dry_run: $scope.data.dry_run + 0,
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
            width: "50%",
        },
        {
            field: 'settings',
            width: "50%",
        },
    ];

    $scope.add = function() {
        shm_templates.add($scope).then(function(data) {
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_templates.edit('Редактирование шаблона',row, $scope).result.then(function(data){
            angular.extend( row, data );
            delete row.$$treeLevel;
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
