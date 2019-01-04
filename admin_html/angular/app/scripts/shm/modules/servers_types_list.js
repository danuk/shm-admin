angular.module('shm_servers_types_list', [
])
  .directive('serversTypesList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: function ($scope, $element, $attrs) {
      },
      templateUrl: "views/shm/modules/servers-types-list/select.html"
    }
  }])
;
