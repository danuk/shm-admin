angular.module('shm_templates_select', [
])
.value('sg_list_shared', {
    'add_item': null,
})
.directive('templatesList', [ 'sg_list_shared', 'shm_request', function( sg_list_shared, shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;

            var request = 'v1/admin/template';
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

            sg_list_shared.add_item = function(data) {
                $scope.items.push( data );
                $scope.data = data;
            }
        },
        templateUrl: "views/shm/modules/templates-list/select.html"
    }
}])
.directive('templatesListAdd', [ 'sg_list_shared', 'shm_templates', function( sg_list_shared, shm_templates ) {
    return {
        restrict: "E",
        scope: {
            add: "&"
        },
        controller: function ($scope, $element, $attrs) {
            $scope.add = function() {
                shm_templates.add().then(function(row) {
                    sg_list_shared.add_item( row );
                }, function(cancel) {
                });
            };
        },
        template: '<a ng-click="add()" class="btn btn-default"><i class="ti ti-plus"></i></a>'
    }
}])
;
