angular
.module('shm', [])
.service('shm', [ '$modal', '$q', '$timeout', function( $modal, $q, $timeout ) {
    this.editJson = function(data) {
        return $modal.open({
            templateUrl: 'views/jsonEditor.html',
            controller: function ($scope, $modalInstance) {
                $scope.obj = {data: data, options: {mode: 'tree'}};
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.save = function () {
                    $modalInstance.close( $scope.obj.data );
                };
            },
            size: 'lg',
        });
    };
    this.list_choises = function(data) {
        return $modal.open({
            templateUrl: 'views/list_choises.html',
            controller: function ($scope, $modalInstance) {
                $scope.data = angular.copy(data);

                $scope.btn_up_disabled = 1;
                $scope.btn_down_disabled = 1;
                $scope.btn_remove_disabled = 1;

                $scope.add = function() {
                    $scope.data.list_to.push( angular.copy( $scope.data.from ) );
                };

                $scope.remove = function() {
                    if ( $scope.data.to ) {
                        $scope.data.list_to.splice( $scope.data.to[0], 1 );
                        $scope.btn_remove_disabled = 1;
                        $scope.btn_down_disabled = 1;
                        $scope.btn_up_disabled = 1;
                    }
                };

                $scope.$watch('data.to', function(newValue, oldValue) {
                    if ( newValue === oldValue) return;

                    var ItemSelected = $scope.data.to[0];
                    $scope.btn_down_disabled = ( ItemSelected == $scope.data.list_to.length - 1 ) ? 1 : 0;
                    $scope.btn_up_disabled = ItemSelected == 0 ? 1 : 0;
                    $scope.btn_remove_disabled = 0;
                }, true);

                $scope.move = function(dir) {
                    var selItemIndex = parseInt( $scope.data.to[0] );

                    var array = $scope.data.list_to;
                    var Item = array[ selItemIndex ];

                    if ( dir === 'up' && selItemIndex > 0 ) {
                            array[ selItemIndex ] = array[ selItemIndex - 1 ];
                            array[ selItemIndex - 1 ] = Item;
                            $scope.data.to[0] = selItemIndex - 1;
                    }
                    else if ( dir === 'down' && array.length > selItemIndex + 1 ) {
                            array[ selItemIndex ] = array[ selItemIndex + 1 ];
                            array[ selItemIndex + 1 ] = Item;
                            $scope.data.to[0] = selItemIndex + 1;
                    }
                }

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };
            },
            size: 'lg',
        });
    }

}])
.directive('toggleInt', function () {
    function link ($scope, $element, attr) {
        $element.on('click', function () {
            $scope.$apply(function() {
                $scope.toggleModel = +!$scope.toggleModel;
            });
        });
        $scope.$watch('toggleModel', function (value) {
            $element.prop('checked', !!value);
        });
    }
    return {
        restrict: 'A',
        scope: {
            toggleModel: '='
        },
        link: link
    };
});

