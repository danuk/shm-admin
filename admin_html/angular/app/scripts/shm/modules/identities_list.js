angular.module('shm_identities_list', [
])
  .directive('identitiesList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: function ($scope, $element, $attrs) {
        if (!$scope.groups_list) {
            shm_request('GET','/admin/identities.cgi').then(function(data) {
                $scope.data_list = data;
            });
        }
      },
      templateUrl: "views/shm/modules/identities-list/select.html"
    }
  }])
;
