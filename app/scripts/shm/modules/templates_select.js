angular.module('shm_templates_select', [
])
.directive('templatesList', [ 'shm_request', function( shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;

            var request = 'admin/template.cgi';
            var key_field = 'id';

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue[key_field];
            });

            if ( $scope.readonly ) {
                request = request + '?id=' + $scope.id;
            }

            shm_request('GET', request).then(function(response) {
                var data = response.data.data;

                if (!data) return;
                $scope.items = data;

                if ( $scope.id ) {
                    data.forEach(function(item) {
                        if ( $scope.id == item[key_field] ) {
                            $scope.data = item;
                        }
                    });
                };
            });
        },
        templateUrl: "views/shm/modules/templates-list/select.html"
    }
}])
;
