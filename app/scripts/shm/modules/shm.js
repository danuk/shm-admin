angular
.module('shm', [])
.service('shm', [ '$modal', 'shm_request', '$q', '$timeout', function( $modal, shm_request, $q, $timeout ) {
    this.list_choises = function(data) {
        return $modal.open({
            templateUrl: 'views/list_choises.html',
            controller: function ($scope, $modalInstance) {
                $scope.data = angular.copy(data);

                $scope.btn_remove_disabled = 0;

                var url = 'v1/admin/service/children';
                $scope.url = url;
                $scope.args = { service_id: data.service_id };

                $scope.columnDefs = [
                    {
                        field: 'service_id',
                        width: 100,
                    },
                    {
                        field: 'name',
                        width: 360,
                    },
                    {
                        field: 'qnt',
                        displayName: 'Кол-во',
                        type: 'number',
                        enableCellEdit: true,
                    },
                ];

                $scope.add = function() {
                    $scope.gridOptions.data.push( $scope.data.from );
                };

                $scope.remove = function() {
                    var rows = $scope.gridApi.selection.getSelectedRows();
                    for ( var i in rows ) {
                        $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( rows[i] ), 1 );
                    }
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    var args = {
                        service_id: data.service_id,
                        children: $scope.gridOptions.data,
                    };

                    shm_request( 'POST_JSON', url, args ).then(function(response) {
                        $modalInstance.close( response.data );
                    });
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
                $scope.toggleModel = !$scope.toggleModel;
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
})
.directive("nextFocus", function () {
   var directive = {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    try {
                        if (attrs.tabindex != undefined) {
                            var currentTabIndex = attrs.tabindex;
                            var nextTabIndex = parseInt(attrs.tabindex) + 1;
                            $("[tabindex=" + nextTabIndex + "]").focus();
                        }
                    } catch (e) {

                    }
                }
            });
        }
    };
    return directive;
})
.directive('autoFocus', function($timeout) {
    return {
        require : 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs) {
            $timeout(function() {
                element.focus();
            }, 100);
        }
    };
})
;


