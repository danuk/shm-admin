angular.module('shm_services_select', [
])
.value('services_list_shared', {
    'add_item': null,
})
.directive('servicesList', [ 'services_list_shared', 'shm_request', function( services_list_shared, shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        controller: function ($scope, $element, $attrs) {
            shm_request('GET', 'admin/services.cgi').then(function(data) {
                $scope.items = data;
                if (!$scope.data && data.length ) $scope.data = data[0].id;
            });

            services_list_shared.add_item = function(data) {
                $scope.items.push( data );
                $scope.data = data.id;
            }
        },
        templateUrl: "views/shm/modules/services-list/select.html"
    }
}])
.directive('servicesListAdd', [ 'services_list_shared', 'shm_services', function( services_list_shared, shm_services ) {
    return {
        restrict: "E",
        scope: {
            add: "&"
        },
        controller: function ($scope, $element, $attrs) {
            $scope.add = function() {
                shm_services.add().then(function(row) {
                    services_list_shared.add_item( row );
                }, function(cancel) {
                });
            };
        },
        template: '<a ng-click="add()" class="btn btn-default"><i class="ti ti-plus"></i></a>'
    }
}])
;
