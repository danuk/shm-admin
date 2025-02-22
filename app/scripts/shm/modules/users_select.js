angular.module('shm_users_select', [
])
.directive('usersList', [ 'shm_request', function( shm_request ) {
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

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue[key_field];
            });

            if ( $scope.readonly ) {
                if ( $scope.id ) {
                    request = request + '?' + key_field + '=' + $scope.id;
                } else return;
            }

            shm_request('GET', request, { limit: 0, filter: '{"block":0}' }).then(function(response) {
                var data = response.data.data;
                if (!data) return;
                $scope.items = data;

                if ( $scope.id ) {
                    data.forEach(function(item) {
                        if ( $scope.id == item[key_field] ) {
                            $scope.data = item;
                        }
                    });
                } else $scope.data = data[0];
            });
        },
        templateUrl: "views/shm/modules/users-list/select.html"
    }
}])
;
