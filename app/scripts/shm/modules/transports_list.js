angular.module('shm_transports_list', [
])
  .directive('transportsList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
        restrict: 'E',
        scope: {
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue;
            });

            var data = [
                'http',
                'ssh',
                'mail',
                'telegram',
            ];

            $scope.items = data;

            if ( $scope.id ) {
                $scope.data = $scope.id;
            };
        },
        templateUrl: "views/shm/modules/transports-list/select.html"
    }
  }])
;
