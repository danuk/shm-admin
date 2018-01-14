angular
.module('shm', [])
.service('shm', [ '$modal', function( $modal ) {
    this.editJson = function(data) {
        return $modal.open({
            templateUrl: 'views/jsonEditor.html',
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
    };
}]);

