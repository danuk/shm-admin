angular.module('shm_users_select', [
])
.value('users_list_shared', {
    'add_item': null,
})
.directive('usersList', [ 'users_list_shared', 'shm_request', function( users_list_shared, shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        controller: function ($scope, $element, $attrs) {
            shm_request('GET', 'admin/users.cgi').then(function(data) {
                $scope.items = data;
                if (!$scope.data && data.length ) $scope.data = data[0].id;
            });

            users_list_shared.add_item = function(data) {
                $scope.items.push( data );
                $scope.data = data.id;
            }
        },
        templateUrl: "views/shm/modules/users-list/select.html"
    }
}])
.directive('usersListAdd', [ 'users_list_shared', 'shm_users', function( users_list_shared, shm_users ) {
    return {
        restrict: "E",
        scope: {
            add: "&"
        },
        controller: function ($scope, $element, $attrs) {
            $scope.add = function() {
                shm_users.add().then(function(row) {
                    users_list_shared.add_item( row );
                }, function(cancel) {
                });
            };
        },
        template: '<a ng-click="add()" class="btn btn-default"><i class="ti ti-plus"></i></a>'
    }
}])
;
