angular.module('shm_users_select', [
])
.directive('usersList', [ 'shm_request', '$timeout', function( shm_request, $timeout ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;
            var request = 'v1/admin/user';
            var key_field = 'user_id';
            $scope.model = {
                search: '',
                items: [],
                dropdownVisible: false,
                selectedIndex: -1,
                onKeyDown: function(event) {
                    if (!$scope.model.dropdownVisible || !$scope.model.items.length) return;
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        if ($scope.model.selectedIndex < $scope.model.items.length - 1) {
                            $scope.model.selectedIndex++;
                        } else {
                            $scope.model.selectedIndex = 0;
                        }
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        if ($scope.model.selectedIndex > 0) {
                            $scope.model.selectedIndex--;
                        } else {
                            $scope.model.selectedIndex = $scope.model.items.length - 1;
                        }
                    } else if (event.key === 'Enter') {
                        event.preventDefault();
                        if ($scope.model.selectedIndex >= 0 && $scope.model.selectedIndex < $scope.model.items.length) {
                            $scope.model.selectUser($scope.model.items[$scope.model.selectedIndex]);
                        }
                    }
                },
                onSearchFocus: function() {
                    if ($scope.model.items.length) {
                        $scope.model.dropdownVisible = true;
                    }
                },
                selectUser: function(user) {
                    $scope.data = user;
                    $scope.id = user[key_field];
                    $scope.model.search = user.user_id + '#' + ' (' + user.login + ') ' + user.full_name;
                    $timeout(function() {
                        $scope.model.dropdownVisible = false;
                    }, 0);
                }
            };
            var searchTimeout;
            $scope.$watch('model.search', function(newVal, oldVal) {
                if (newVal === oldVal) return;
                $scope.model.dropdownVisible = !!newVal;
                if (searchTimeout) $timeout.cancel(searchTimeout);
                searchTimeout = $timeout(function() {
                    if (!newVal || newVal.length < 1) {
                        $scope.model.items = [];
                        $scope.model.dropdownVisible = false;
                        return;
                    }
                    var filter = { block: 0 };
                    filter['-or'] = [
                        { 'full_name': { '-like': '%' + newVal + '%' } },
                        { 'login': { '-like': '%' + newVal + '%' } },
                        { 'user_id': newVal },
                    ];
                    shm_request('GET', request, { limit: 10, filter: JSON.stringify(filter) }).then(function(response) {
                        var data = response.data.data;
                        $scope.model.items = data || [];
                    });
                }, 300);
            });
            $scope.$watch('model.items', function(newVal) {
                $scope.model.selectedIndex = newVal && newVal.length ? 0 : -1;
            });

            if ($scope.id) {
                var filter = { limit: 1 };
                filter[key_field] = $scope.id;
                shm_request('GET', request, filter).then(function(response) {
                    var data = response.data.data;
                    if (data && data.length) {
                        $scope.data = data[0];
                        $scope.model.search = data[0].user_id + '#' + ' (' + data[0].login + ') ' + data[0].full_name;
                        $timeout(function() {
                            $scope.model.dropdownVisible = false;
                        }, 0);
                    }
                });
                return;
            }
        },
        templateUrl: "views/shm/modules/users-list/select.html"
    }
}])
;
