angular.module('shm_identities_list', [
    'shm_identities',
])
.value('identities_list_shared', {
    'add_item': null,
})
.directive('identitiesList', [ 'identities_list_shared', 'shm_request', function( identities_list_shared, shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        controller: function ($scope, $element, $attrs) {
            shm_request('GET', '/admin/identities.cgi').then(function(data) {
                $scope.items = data;
                if (!$scope.data && data.length ) $scope.data = data[0].id;
            });

            identities_list_shared.add_item = function(data) {
                $scope.items.push( data );
                $scope.data = data.id;
            }
        },
        templateUrl: "views/shm/modules/identities-list/select.html"
    }
}])
.directive('identitiesListAdd', [ 'identities_list_shared', 'shm_identities', function( identities_list_shared, shm_identities ) {
    return {
        restrict: "E",
        scope: {
            add: "&"
        },
        controller: function ($scope, $element, $attrs) {
            $scope.add = function() {
                shm_identities.add().then(function(row) {
                    identities_list_shared.add_item( row );
                }, function(cancel) {
                });
            };
        },
        template: '<a ng-click="add()" class="btn btn-default"><i class="ti ti-plus"></i></a>'
    }
}])
;
