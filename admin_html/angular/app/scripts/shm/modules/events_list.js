angular.module('shm_events_list', [
])
  .directive('eventsList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: function ($scope, $element, $attrs) {
      },
      templateUrl: "views/shm/modules/events-list/select.html"
    }
  }])
;
