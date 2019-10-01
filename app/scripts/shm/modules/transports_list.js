angular.module('shm_transports_list', [
])
  .directive('transportsList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: function ($scope, $element, $attrs) {
          if (!$scope.data) $scope.data='ssh';
      },
      templateUrl: "views/shm/modules/transports-list/select.html"
    }
  }])
;
