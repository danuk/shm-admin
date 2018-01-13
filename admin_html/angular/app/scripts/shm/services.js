angular
  .module('shm_services', [
    'angular-jsoneditor',
  ])
  .controller('ShmServicesController', ['$scope', '$modal','simpleService', 'shm_request', function($scope, $modal, simpleService, shm_request) {
    'use strict';

    $scope.url = 'admin/services.cgi';
    $scope.parent_key_id = 'service_id';

    $scope.columnDefs = [
        {field: 'service_id'},
        {field: 'name'},
        {field: 'category'},
        {field: 'cost', displayName: 'Цена'},
    ];

	$scope.openModal = function (title, row, size) {
		var modalInstance = $modal.open({
			templateUrl: 'edit.tmpl',
			controller: function ($scope, $modalInstance, $modal) {
				$scope.title = title;
				$scope.data = angular.copy(row);
                
                // Load childs
                shm_request('GET','/'+url, { parent: row.service_id } ).then(function(data) {
                    $scope.data.children = data;
                });

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};

                $scope.editJson = function(data) {
                    var editJson = $modal.open({
                        templateUrl: 'editJson.tmpl',
			            controller: function ($scope, $modalInstance) {
                            $scope.obj = {data: data, options: {mode: 'tree'}};
                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.save = function () {
                                $modalInstance.close( $scope.obj.data );
                            };
                        },
                        size: 'lg',
                    });
                    editJson.result.then(function(json) {
                        $scope.data.config = json;
                    });
                }
			},
			size: size,
		});
	}
  
    $scope.row_dbl_click = function(row) {
		$scope.openModal('Редактирование услуги', row, 'lg');
    }

  }]);
