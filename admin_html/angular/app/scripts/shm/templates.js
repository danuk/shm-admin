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

                $scope.name_pattern = '\\w+';

                var url = 'admin/template.cgi';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    shm_request( $scope.data.id ? 'POST_JSON' : 'PUT_JSON','/'+url, $scope.data ).then(function(row) {
                        $modalInstance.close( $scope.data );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE','/'+url+'?id='+row.id ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmTemplatesController', ['$scope', 'shm_templates', function($scope, shm_templates) {
    'use strict';

    var url = 'admin/template.cgi';
    $scope.url = url;
    $scope.parent_key_id = 'id';

    $scope.columnDefs = [
        {
            field: 'id',
            width: 100,
        },
        {
            field: 'name',
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
