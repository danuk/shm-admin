angular.module('shm_events_select', [
])
.directive('eventsList', [ 'shm_request', function( shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',
            kind: '=?kind',
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;

            var request = 'admin/events.cgi';
            var key_field = 'id';

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue[key_field];
            });

            if ( $scope.readonly ) {
                request = request + '?' + key_field + '=' + $scope.id;
            }
            else if ( $scope.kind ) {
                request += '?kind=' + $scope.kind;
            };

            shm_request('GET', request).then(function(response) {
                var data = response.data;

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
        templateUrl: "views/shm/modules/events-list/select.html"
    }
}])
;
