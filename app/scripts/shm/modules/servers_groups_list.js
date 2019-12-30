angular.module('shm_servers_groups_list', [
    'shm_servers_groups',
])
.value('sg_list_shared', {
    'add_item': null,
})
.directive('serversGroupsList', [ 'sg_list_shared', 'shm_request', function( sg_list_shared, shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {

            var key_field = 'group_id';

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue[key_field];
            });

            shm_request('GET', '/admin/server_groups.cgi').then(function(response) {
                var data = response.data;

                if (!data) return;
                $scope.items = data;

                if ( $scope.id ) {
                    data.forEach(function(item) {
                        if ( $scope.id == item[key_field] ) {
                            $scope.data = item;
                        }
                    });
                }
            });

            sg_list_shared.add_item = function(data) {
                $scope.items.push( data );
                $scope.data = data;
            }
        },
        templateUrl: "views/shm/modules/servers-groups-list/select.html"
    }
}])
.directive('serversGroupsListAdd', [ 'sg_list_shared', 'shm_servers_groups', function( sg_list_shared, shm_servers_groups ) {
    return {
        restrict: "E",
        scope: {
            add: "&"
        },
        controller: function ($scope, $element, $attrs) {
            $scope.add = function() {
                shm_servers_groups.add().then(function(row) {
                    sg_list_shared.add_item( row );
                }, function(cancel) {
                });
            };
        },
        template: '<a ng-click="add()" class="btn btn-default"><i class="ti ti-plus"></i></a>'
    }
}])
;
