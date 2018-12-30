angular.module('shm_servers_groups_list', [
])
  .directive('serversGroupsList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: function ($scope, $element, $attrs) {
        if (!$scope.groups_list) {
            shm_request('GET','/admin/server_groups.cgi').then(function(data) {
                $scope.groups_list = data;
            });
        }
      },
      templateUrl: "views/shm/modules/servers-groups-list/select.html"
    }
  }])
;
