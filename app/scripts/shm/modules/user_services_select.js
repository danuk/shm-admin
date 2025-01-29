angular.module('shm_user_services_select', [
])
.directive('userServicesList', [ 'shm_request', function( shm_request ) {
    return {
        restrict: 'E',
        scope: {
            uid: '=', // required
            data: '=?', // optional
            id: '=?', // optional
        },
        link: function ($scope, $element, $attrs) {
            // don't load a data when id is present but not defined
            // if you want to load all user services, don't use the id
            if ( $scope.hasOwnProperty('id') && ! $scope.id ) return;

            $scope.readonly = 'readonly' in $attrs;

            var request = 'v1/admin/user/service';
            var args = {
                user_id: $scope.uid,
                limit: 0,
            };
            var key_field = 'user_service_id';

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue[key_field];
            });

            if ( $scope.readonly ) {
                args['usi'] = $scope.id;
            }

            shm_request('GET', request, args).then(function(response) {
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
        templateUrl: "views/shm/modules/user-services-list/select.html"
    }
}])
;
