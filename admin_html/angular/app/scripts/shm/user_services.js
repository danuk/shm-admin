angular
  .module('shm_user_services', [
  ])
  .controller('ShmUserServicesController', ['$scope', '$modal', function($scope, $modal) {
    'use strict';

    $scope.url = 'admin/user_services.cgi';
    $scope.parent_key_id = 'user_service_id';
    $scope.maxDeepLevel = 2;

    $scope.columnDefs = [
        {field: 'user_service_id', width: 120},
        {field: 'name'},
        {field: 'user_id',width: 100},
        {field: 'status', width: 100},
        {field: 'expired'},
        //{field: 'cost', displayName: 'Цена'},
    ];

	$scope.openDemoModal = function (title, row, size) {
		var modalInstance = $modal.open({
			templateUrl: 'edit.tmpl',
			controller: function ($scope, $modalInstance) {
				$scope.title = title;
				$scope.row = row;
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			},
			size: size,
		});
	}
  
    $scope.row_dbl_click = function(row) {
		$scope.openDemoModal('Редактирование услуги', row, 'lg');
    }

  }]);
